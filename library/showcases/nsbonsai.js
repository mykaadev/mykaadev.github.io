// NsBonsai showcase: the name that the NsBonsai review window proposes for one asset.
// The functions port the plugin C++ code. A comment above each function names its source.
// Paths without a prefix are in the NsBonsai repo. "Engine/" paths are in Unreal Engine 5.7.
(function () {
  "use strict";

  if (!window.NsShowcase) {
    return;
  }

  // Engine/Source/Runtime/Core/Public/UObject/NameTypes.h:179 (INVALID_OBJECTNAME_CHARACTERS)
  var INVALID_OBJECT_NAME_CHARACTERS = "\"' ,/.:|&!~\n\r\t@#(){}[]=;^%$`";

  // Source/NsBonsai/Private/NsBonsaiReviewManager.cpp:366
  var ACRONYMS = ["AI", "UI", "UX", "HUD", "VFX", "SFX", "FX", "NPC", "LOD", "IK", "FK"];

  // The entries of the asset-name menu of the review window (NsBonsaiReviewManager.cpp:1312)
  var CASE_MODES = [
    ["smart", "Use smart prefill"],
    ["original", "Reset to original"],
    ["acronyms", "Uppercase acronyms (UI/VFX/etc.)"],
    ["pascal", "To PascalCase"],
    ["snake", "To snake_case"]
  ];

  var IS_ALPHA = /^\p{L}$/u;
  var IS_ALNUM = /^[\p{L}\p{N}]$/u;
  var IS_UPPER = /^\p{Lu}$/u;
  var IS_LOWER = /^\p{Ll}$/u;
  var IS_DIGIT = /^[0-9]$/;
  var IS_SPACE = /^\s$/;

  // An FName compares without case, so the demo compares tokens in upper case
  function key(token) {
    return String(token).toUpperCase();
  }

  function sameToken(a, b) {
    return key(a) === key(b);
  }

  function makeSet() {
    return Object.create(null);
  }

  // FString::Compare with ESearchCase::IgnoreCase
  function compareIgnoreCase(a, b) {
    var left = a.toLowerCase();
    var right = b.toLowerCase();
    return left < right ? -1 : (left > right ? 1 : 0);
  }

  // FString::ParseIntoArray with bCullEmpty = true
  function splitParts(text, separator) {
    return text.split(separator).filter(function (part) {
      return part.length > 0;
    });
  }

  function everyChar(text, test) {
    for (var i = 0; i < text.length; i++) {
      if (!test(text[i])) {
        return false;
      }
    }
    return true;
  }

  // Source/NsBonsai/Private/NsBonsaiSettings.cpp:575 (NormalizeToken)
  function normalizeToken(settings, token) {
    if (!token) {
      return "";
    }
    for (var i = 0; i < settings.aliases.length; i++) {
      var rule = settings.aliases[i];
      if (rule.from && rule.to && sameToken(token, rule.from)) {
        return rule.to;
      }
    }
    return token;
  }

  // Source/NsBonsai/Private/NsBonsaiSettings.cpp:48 and NsBonsaiNameRules.cpp:12 (CollapseUnderscores)
  function collapseUnderscores(text) {
    return text.replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  }

  // Source/NsBonsai/Private/NsBonsaiSettings.cpp:81 (SanitizeToken)
  function sanitizeToken(token) {
    var working = token.trim().split(" ").join("_").split("-").join("_");
    var out = "";
    for (var i = 0; i < working.length; i++) {
      if (IS_ALNUM.test(working[i]) || working[i] === "_") {
        out += working[i];
      }
    }
    return collapseUnderscores(out);
  }

  // Source/NsBonsai/Private/NsBonsaiSettings.cpp:134 (NormalizeAndValidateSettings: separator, type rules, domains)
  function validateSettings(settings) {
    if (!settings.separator) {
      settings.separator = "_";
    }

    var seenPaths = makeSet();
    settings.typeRules = settings.typeRules.filter(function (rule) {
      rule.token = sanitizeToken(rule.token);
      if (seenPaths[rule.classPath]) {
        return false;
      }
      seenPaths[rule.classPath] = true;
      return true;
    });

    var seenDomains = makeSet();
    settings.domains = settings.domains.filter(function (domain) {
      var token = normalizeToken(settings, sanitizeToken(domain.token));
      if (!token || seenDomains[key(token)]) {
        return false;
      }
      seenDomains[key(token)] = true;
      domain.token = token;

      var seenCategories = makeSet();
      domain.categories = domain.categories.map(function (category) {
        return normalizeToken(settings, sanitizeToken(category));
      }).filter(function (category) {
        if (!category || seenCategories[key(category)]) {
          return false;
        }
        seenCategories[key(category)] = true;
        return true;
      });
      return true;
    });
  }

  // Source/NsBonsai/Private/NsBonsaiSettings.cpp:372 (GetDomainTokens)
  function getDomainTokens(settings) {
    var seen = makeSet();
    var out = [];
    settings.domains.forEach(function (domain) {
      var token = normalizeToken(settings, domain.token);
      if (token && !seen[key(token)]) {
        seen[key(token)] = true;
        out.push(token);
      }
    });
    return out;
  }

  // Source/NsBonsai/Private/NsBonsaiSettings.cpp:387 (GetCategoryTokens, with domains on)
  function getCategoryTokens(settings, domainToken) {
    var normalizedDomain = normalizeToken(settings, domainToken);
    var seen = makeSet();
    var out = [];
    for (var i = 0; i < settings.domains.length; i++) {
      if (!sameToken(normalizeToken(settings, settings.domains[i].token), normalizedDomain)) {
        continue;
      }
      settings.domains[i].categories.forEach(function (value) {
        var category = normalizeToken(settings, value);
        if (category && !seen[key(category)]) {
          seen[key(category)] = true;
          out.push(category);
        }
      });
      break;
    }
    return out;
  }

  function containsToken(list, token) {
    return list.some(function (item) {
      return sameToken(item, token);
    });
  }

  // Source/NsBonsai/Private/NsBonsaiSettings.cpp:431 (IsDomainTokenValid)
  function isDomainTokenValid(settings, domainToken) {
    var normalized = normalizeToken(settings, domainToken);
    return !!normalized && containsToken(getDomainTokens(settings), normalized);
  }

  // Source/NsBonsai/Private/NsBonsaiSettings.cpp:454 (IsCategoryTokenValid, categories must belong to the domain)
  function isCategoryTokenValid(settings, domainToken, categoryToken) {
    var normalized = normalizeToken(settings, categoryToken);
    if (!normalized) {
      return false;
    }
    var categories = getCategoryTokens(settings, domainToken);
    return categories.length > 0 && containsToken(categories, normalized);
  }

  // Source/NsBonsai/Private/NsBonsaiNameBuilder.cpp:26 (IsVariantToken: letters only, any case)
  function isBuilderVariantToken(token) {
    return token.length > 0 && everyChar(token, function (c) { return IS_ALPHA.test(c); });
  }

  // Source/NsBonsai/Private/NsBonsaiNameBuilder.cpp:44 (SanitizeVariantToken)
  function sanitizeVariantToken(token) {
    var trimmed = token.trim();
    var out = "";
    for (var i = 0; i < trimmed.length; i++) {
      if (IS_ALPHA.test(trimmed[i])) {
        out += trimmed[i].toUpperCase();
      }
    }
    return isBuilderVariantToken(out) ? out : "A";
  }

  // Source/NsBonsai/Private/NsBonsaiNameBuilder.cpp:63 (ParseExistingAssetName)
  function parseExistingAssetName(name, settings) {
    var parsed = { type: "", domain: "", category: "", variant: "", assetName: "" };
    var parts = splitParts(name, settings.separator);
    if (parts.length === 0) {
      return parsed;
    }
    if (isBuilderVariantToken(parts[parts.length - 1])) {
      parsed.variant = sanitizeVariantToken(parts.pop());
    }

    var knownTypes = makeSet();
    settings.typeRules.forEach(function (rule) {
      if (rule.token) {
        knownTypes[key(normalizeToken(settings, rule.token))] = true;
      }
    });
    var categoriesByDomain = makeSet();
    var knownDomains = makeSet();
    var knownCategories = makeSet();
    settings.domains.forEach(function (domain) {
      var domainKey = key(normalizeToken(settings, domain.token));
      knownDomains[domainKey] = true;
      var set = categoriesByDomain[domainKey] || (categoriesByDomain[domainKey] = makeSet());
      domain.categories.forEach(function (category) {
        var categoryKey = key(normalizeToken(settings, category));
        set[categoryKey] = true;
        knownCategories[categoryKey] = true;
      });
    });

    // A matched token keeps the case of the old name, as a case-preserving FName does
    var assetParts = [];
    parts.forEach(function (part) {
      var normalized = normalizeToken(settings, part);
      var partKey = key(normalized);
      if (!parsed.type && knownTypes[partKey]) {
        parsed.type = normalized;
        return;
      }
      if (!parsed.domain && knownDomains[partKey]) {
        parsed.domain = normalized;
        return;
      }
      if (!parsed.category) {
        if (parsed.domain) {
          var set = categoriesByDomain[key(parsed.domain)];
          if (set && set[partKey]) {
            parsed.category = normalized;
            return;
          }
        } else if (knownCategories[partKey]) {
          parsed.category = normalized;
          return;
        }
      }
      assetParts.push(part);
    });
    parsed.assetName = assetParts.join(settings.separator);
    return parsed;
  }

  // Source/NsBonsai/Private/NsBonsaiAssetEvaluator.cpp:30 (Evaluate), with no recent domains or categories
  function evaluate(name, settings) {
    var parsed = parseExistingAssetName(name, settings);
    var domains = getDomainTokens(settings).sort(compareIgnoreCase);
    var domainFound = !!parsed.domain && containsToken(domains, parsed.domain);
    var domain = domainFound ? parsed.domain : (domains[0] || "");
    var categories = getCategoryTokens(settings, domain).sort(compareIgnoreCase);
    var categoryFound = !!parsed.category && containsToken(categories, parsed.category);
    var category = categoryFound ? parsed.category : (categories[0] || "");
    return { parsed: parsed, domain: domain, category: category, domainFound: domainFound, categoryFound: categoryFound };
  }

  // Source/NsBonsai/Private/NsBonsaiNameRules.cpp:54 (NormalizeTokenForCompare)
  function normalizeTokenForCompare(token) {
    return token.trim().toUpperCase();
  }

  // Source/NsBonsai/Private/NsBonsaiNameRules.cpp:62 (IsVariantToken: upper-case letters only)
  function isRulesVariantToken(token) {
    return token.length > 0 && everyChar(token, function (c) { return IS_UPPER.test(c) && IS_ALPHA.test(c); });
  }

  // Engine/Source/Editor/UnrealEd/Private/ObjectTools.cpp:4621 (SanitizeObjectName)
  function sanitizeObjectName(text) {
    var out = "";
    for (var i = 0; i < text.length; i++) {
      out += INVALID_OBJECT_NAME_CHARACTERS.indexOf(text[i]) >= 0 ? "_" : text[i];
    }
    return out;
  }

  // Source/NsBonsai/Private/NsBonsaiNameRules.cpp:45 (SanitizeAssetName)
  function sanitizeAssetName(text) {
    var working = text.trim().split(" ").join("_");
    return collapseUnderscores(sanitizeObjectName(working));
  }

  // Source/NsBonsai/Private/NsBonsaiNameRules.cpp:126 (SmartPrefillAssetName). The demo also keeps the removed tokens.
  function smartPrefillAssetName(original, settings) {
    var separator = settings.separator;
    var knownTypes = makeSet();
    settings.typeRules.forEach(function (rule) {
      var token = normalizeToken(settings, rule.token);
      if (token) {
        knownTypes[normalizeTokenForCompare(token)] = true;
      }
    });
    var knownDomains = makeSet();
    getDomainTokens(settings).forEach(function (domain) {
      knownDomains[normalizeTokenForCompare(domain)] = true;
    });
    var knownCategories = makeSet();
    settings.domains.forEach(function (domain) {
      domain.categories.forEach(function (category) {
        var normalized = normalizeToken(settings, category);
        if (normalized) {
          knownCategories[normalizeTokenForCompare(normalized)] = true;
        }
      });
    });

    var removed = [];
    var tokens = splitParts(original, separator);
    if (tokens.length === 0) {
      return { name: sanitizeAssetName(original) || "New", removed: removed };
    }

    var start = 0;
    if (knownTypes[normalizeTokenForCompare(tokens[0])]) {
      start = 1;
      removed.push(tokens[0]);
    }
    var remaining = [];
    for (var i = start; i < tokens.length; i++) {
      var normalized = normalizeTokenForCompare(tokens[i]);
      if (knownDomains[normalized] || knownCategories[normalized]) {
        removed.push(tokens[i]);
        continue;
      }
      remaining.push(tokens[i]);
    }
    if (remaining.length > 0 && isRulesVariantToken(remaining[remaining.length - 1])) {
      removed.push(remaining.pop());
    }

    var candidate = sanitizeAssetName(remaining.join(separator));
    if (candidate) {
      return { name: candidate, removed: removed };
    }
    return { name: sanitizeAssetName(original) || "New", removed: removed };
  }

  // Source/NsBonsai/Private/NsBonsaiReviewManager.cpp:313 (ToPascalCase)
  function toPascalCase(text) {
    return splitParts(text, "_").map(sanitizeAssetName).filter(Boolean).map(function (part) {
      part = part.toLowerCase();
      return part[0].toUpperCase() + part.slice(1);
    }).join("");
  }

  // Source/NsBonsai/Private/NsBonsaiReviewManager.cpp:333 (ToSnakeCase)
  function toSnakeCase(text) {
    var out = "";
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (IS_SPACE.test(c) || c === "-") {
        out += "_";
        continue;
      }
      if (IS_UPPER.test(c) && out.length > 0) {
        var previous = text[i - 1];
        if (IS_LOWER.test(previous) || IS_DIGIT.test(previous)) {
          out += "_";
        }
      }
      out += c;
    }
    return sanitizeAssetName(out).toLowerCase();
  }

  // Source/NsBonsai/Private/NsBonsaiReviewManager.cpp:364 (UppercaseCommonAcronyms)
  function uppercaseCommonAcronyms(text) {
    return text.split("_").map(function (part) {
      var upper = normalizeTokenForCompare(part);
      return ACRONYMS.indexOf(upper) >= 0 ? upper : part;
    }).join("_");
  }

  // Source/NsBonsai/Private/NsBonsaiReviewManager.cpp:1276 (SetRowAssetName)
  function setRowAssetName(row, proposed) {
    return sanitizeAssetName(proposed) || sanitizeAssetName(row.smart) || sanitizeAssetName(row.parsedBase) ||
      sanitizeAssetName(row.current) || "New";
  }

  // Source/NsBonsai/Private/NsBonsaiNameRules.cpp:292 (BuildNameFromRowState, with the preview variant "A")
  function buildNameParts(settings, typeToken, domain, category, assetName) {
    return [
      { kind: "type", text: normalizeToken(settings, typeToken) },
      { kind: "domain", text: normalizeToken(settings, domain) },
      { kind: "category", text: normalizeToken(settings, category) },
      { kind: "asset", text: assetName },
      { kind: "variant", text: "A" }
    ];
  }

  // Source/NsBonsai/Private/NsBonsaiNameRules.cpp:209 (ParseNameWithSettings) and :541 (IsCompliant)
  function isCompliant(name, typeToken, settings) {
    var order = ["type", "domain", "category", "asset", "variant"];
    var parts = splitParts(name, settings.separator);
    if (parts.length < order.length) {
      return false;
    }
    var parsed = {};
    var index = 0;
    for (var c = 0; c < order.length; c++) {
      var after = order.length - c - 1;
      var remaining = parts.length - index;
      if (order[c] === "asset") {
        var count = remaining - after;
        if (count < 1) {
          return false;
        }
        parsed.asset = parts.slice(index, index + count).join(settings.separator);
        index += count;
        continue;
      }
      if (remaining <= after) {
        return false;
      }
      parsed[order[c]] = parts[index++];
    }
    if (index !== parts.length || !typeToken || !sameToken(normalizeToken(settings, parsed.type), typeToken)) {
      return false;
    }
    var domain = normalizeToken(settings, parsed.domain);
    return isDomainTokenValid(settings, domain) && isCategoryTokenValid(settings, domain, parsed.category) &&
      !!sanitizeAssetName(parsed.asset) && isRulesVariantToken(parsed.variant);
  }

  function readSettings(root) {
    var settings = { separator: root.dataset.separator || "_", typeRules: [], domains: [], aliases: [] };
    root.querySelectorAll('[data-list="aliases"] li').forEach(function (item) {
      var codes = item.querySelectorAll("code");
      if (codes.length >= 2) {
        settings.aliases.push({ from: codes[0].textContent.trim(), to: codes[1].textContent.trim() });
      }
    });
    root.querySelectorAll('[data-list="types"] tbody tr').forEach(function (row) {
      var cells = row.querySelectorAll("td");
      if (cells.length >= 2) {
        settings.typeRules.push({ classPath: cells[0].textContent.trim(), token: cells[1].textContent.trim() });
      }
    });
    root.querySelectorAll('[data-list="domains"] li').forEach(function (item) {
      var name = item.querySelector("b");
      var list = item.querySelector("span");
      if (name) {
        settings.domains.push({
          token: name.textContent.trim(),
          categories: list ? list.textContent.split(",").map(function (c) { return c.trim(); }).filter(Boolean) : []
        });
      }
    });
    validateSettings(settings);
    return settings;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function className(classPath) {
    return classPath.slice(classPath.lastIndexOf(".") + 1);
  }

  window.NsShowcase.register(".ns-bonsai", function (root) {
    var settings = readSettings(root);
    if (settings.typeRules.length === 0 || settings.domains.length === 0) {
      throw new Error("no rules");
    }
    var examples = Array.prototype.map.call(root.querySelectorAll('[data-list="examples"] li'), function (item) {
      var code = item.querySelector("code");
      return { classPath: item.dataset.class || "", name: code ? code.textContent : "" };
    }).filter(function (example) {
      return example.name;
    });

    var state = { ruleIndex: 0, name: "", domain: "", category: "", domainPicked: false, categoryPicked: false, caseMode: "smart" };
    var evaluation = null;
    var prefill = null;

    function field(labelText, control, extraClass) {
      var label = el("label", "ns-bonsai-field" + (extraClass ? " " + extraClass : ""));
      label.appendChild(el("span", "ns-bonsai-label", labelText));
      label.appendChild(control);
      return label;
    }

    function select(options) {
      var node = el("select", "ns-bonsai-input");
      options.forEach(function (option) {
        var item = el("option", "", option[1]);
        item.value = option[0];
        node.appendChild(item);
      });
      return node;
    }

    // Controls: asset type, old name, examples, then the three choices of a review row
    var app = el("div", "ns-bonsai-app");
    var typeSelect = select(settings.typeRules.map(function (rule, index) {
      return [String(index), className(rule.classPath) + " (" + rule.token + ")"];
    }));
    var nameInput = el("input", "ns-bonsai-input ns-bonsai-name");
    nameInput.type = "text";
    nameInput.spellcheck = false;
    nameInput.autocomplete = "off";
    nameInput.setAttribute("autocapitalize", "off");
    nameInput.placeholder = "Old asset name";

    var rowOne = el("div", "ns-bonsai-row");
    rowOne.appendChild(field("Asset type", typeSelect));
    rowOne.appendChild(field("Old name", nameInput, "ns-bonsai-field--wide"));
    app.appendChild(rowOne);

    var exampleBox = el("div", "ns-bonsai-examples");
    exampleBox.setAttribute("role", "group");
    exampleBox.setAttribute("aria-label", "Example names");
    examples.forEach(function (example) {
      var button = el("button", "ns-bonsai-example", example.name);
      button.type = "button";
      button.title = className(example.classPath);
      button.addEventListener("click", function () {
        var index = settings.typeRules.findIndex(function (rule) { return rule.classPath === example.classPath; });
        state.ruleIndex = index >= 0 ? index : state.ruleIndex;
        typeSelect.value = String(state.ruleIndex);
        nameInput.value = example.name;
        setName(example.name);
      });
      exampleBox.appendChild(button);
    });
    app.appendChild(exampleBox);

    var domainSelect = select(getDomainTokens(settings).sort(compareIgnoreCase).map(function (d) { return [d, d]; }));
    var categorySelect = select([]);
    var caseSelect = select(CASE_MODES);
    var rowTwo = el("div", "ns-bonsai-row");
    rowTwo.appendChild(field("Domain", domainSelect));
    rowTwo.appendChild(field("Category", categorySelect));
    rowTwo.appendChild(field("Asset name", caseSelect, "ns-bonsai-field--wide"));
    app.appendChild(rowTwo);

    var result = el("div", "ns-bonsai-result");
    result.setAttribute("aria-live", "polite");
    var why = el("ul", "ns-bonsai-why");
    var note = el("p", "ns-bonsai-note");
    app.appendChild(result);
    app.appendChild(why);
    app.appendChild(note);

    var caption = root.querySelector("figcaption");
    root.insertBefore(app, caption ? caption.nextSibling : root.firstChild);

    // A new old name gives a new review row: new preselects and a new prefill
    function setName(name) {
      state.name = name;
      evaluation = evaluate(name, settings);
      prefill = smartPrefillAssetName(name, settings);
      state.domain = evaluation.domain;
      state.category = evaluation.category;
      state.domainPicked = false;
      state.categoryPicked = false;
      render();
    }

    // Source/NsBonsai/Private/NsBonsaiReviewManager.cpp:256 (the first asset name of a row), then the menu entry
    function currentAssetName() {
      var row = { current: state.name, parsedBase: evaluation.parsed.assetName, smart: prefill.name };
      var initial = row.smart ? row.smart : (row.parsedBase ? row.parsedBase : row.current);
      var base = setRowAssetName(row, initial);
      switch (state.caseMode) {
        case "original":
          return setRowAssetName(row, row.current);
        case "acronyms":
          return setRowAssetName(row, uppercaseCommonAcronyms(base));
        case "pascal":
          return setRowAssetName(row, toPascalCase(base));
        case "snake":
          return setRowAssetName(row, toSnakeCase(base));
        default:
          return base;
      }
    }

    function selectToken(node, token) {
      for (var i = 0; i < node.options.length; i++) {
        if (sameToken(node.options[i].value, token)) {
          node.selectedIndex = i;
          return;
        }
      }
    }

    function addWhy(kind, label, token, text) {
      var item = el("li", "ns-bonsai-why-item");
      var body = el("span", "ns-bonsai-text");
      body.appendChild(el("code", "ns-bonsai-part--" + kind, token));
      body.appendChild(document.createTextNode(" " + text));
      item.appendChild(el("span", "ns-bonsai-key ns-bonsai-part--" + kind, label));
      item.appendChild(body);
      why.appendChild(item);
    }

    function render() {
      var rule = settings.typeRules[state.ruleIndex];
      var typeToken = normalizeToken(settings, rule.token);

      selectToken(domainSelect, state.domain);
      categorySelect.textContent = "";
      getCategoryTokens(settings, state.domain).sort(compareIgnoreCase).forEach(function (category) {
        var option = el("option", "", category);
        option.value = category;
        categorySelect.appendChild(option);
      });
      selectToken(categorySelect, state.category);

      var assetName = currentAssetName();
      var parts = buildNameParts(settings, typeToken, state.domain, state.category, assetName);
      result.textContent = "";
      var line = el("code", "ns-bonsai-final");
      parts.forEach(function (part, index) {
        if (index > 0) {
          line.appendChild(el("span", "ns-bonsai-sep", settings.separator));
        }
        line.appendChild(el("span", "ns-bonsai-part--" + part.kind, part.text));
      });
      result.appendChild(el("span", "ns-bonsai-label", "Final name"));
      result.appendChild(line);

      why.textContent = "";
      addWhy("type", "Type", parts[0].text, "From the type rule of " + className(rule.classPath) + ". A type token in the old name does not count.");
      addWhy("domain", "Domain", parts[1].text, state.domainPicked ? "Your pick." : (evaluation.domainFound
        ? "Found in the old name."
        : "Not in the old name. The window selects the first domain from A to Z. Pick a domain."));
      addWhy("category", "Category", parts[2].text, state.categoryPicked ? "Your pick." : (evaluation.categoryFound && !state.domainPicked
        ? "Found in the old name, in the categories of the domain."
        : "The window selects the first category of the domain from A to Z."));
      var assetText;
      if (state.caseMode === "original") {
        assetText = "The full old name, sanitized.";
      } else {
        assetText = "Smart prefill: the old name without type, domain, category, and variant tokens" +
          (prefill.removed.length ? " (" + prefill.removed.join(", ") + ")" : "") + ". Spaces and invalid characters become underscores.";
        if (state.caseMode !== "smart") {
          assetText += " Then: " + caseSelect.options[caseSelect.selectedIndex].text + ".";
        }
      }
      addWhy("asset", "Asset name", parts[3].text, assetText);
      addWhy("variant", "Variant", parts[4].text, "The preview uses A. At rename, NsBonsai takes the first free variant: A to Z, then AA.");

      var compliant = isCompliant(state.name, typeToken, settings);
      note.textContent = compliant
        ? "The old name is already in the pattern. With Skip Compliant Assets on (the default), NsBonsai does not queue this asset."
        : "";
      note.hidden = !compliant;
    }

    typeSelect.addEventListener("change", function () {
      state.ruleIndex = Number(typeSelect.value) || 0;
      render();
    });
    nameInput.addEventListener("input", function () {
      setName(nameInput.value);
    });
    // Source/NsBonsai/Private/NsBonsaiReviewManager.cpp:1183 (ApplyDomain: a new domain selects its first category)
    domainSelect.addEventListener("change", function () {
      state.domain = domainSelect.value;
      state.category = getCategoryTokens(settings, state.domain).sort(compareIgnoreCase)[0] || "";
      state.domainPicked = true;
      state.categoryPicked = false;
      render();
    });
    categorySelect.addEventListener("change", function () {
      state.category = categorySelect.value;
      state.categoryPicked = true;
      render();
    });
    caseSelect.addEventListener("change", function () {
      state.caseMode = caseSelect.value;
      render();
    });

    // Start with the first example, if there is one
    var first = examples[0];
    if (first) {
      var firstIndex = settings.typeRules.findIndex(function (rule) { return rule.classPath === first.classPath; });
      state.ruleIndex = firstIndex >= 0 ? firstIndex : 0;
      nameInput.value = first.name;
    }
    typeSelect.value = String(state.ruleIndex);
    setName(nameInput.value);
  });
})();
