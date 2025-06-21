# Copyright (C) 2024 mykaa. All rights reserved.

require "net/http"
require "uri"
require "fileutils"

module Jekyll
  class FetchReadmes < Generator
    safe      true
    priority  :low

    PLUGINS = {
      "NsNeuralFramework" => "main",
      "NsSynapse"         => "main",
      "NsSpyglass"        => "main",
      "NsSaveWizard"      => "main",
      "NsAchievements"    => "main",
      "NsInteraction"     => "main",
      "NsUIFramework"     => "main",
      "NsConsole"         => "main",
      "NsProjectMaid"     => "main",
      "NsDataHandler"     => "main",
      "NsTextFlow"        => "main",
      "NsTween"           => "main"
    }.freeze

    def remove_gh_only_sections(content)
      content.gsub(/<!--\s*GH_ONLY_START\s*-->.*?<!--\s*GH_ONLY_END\s*-->/m, "")
    end

    def remove_meta_blocks(content)
      content.gsub(/<!--\s*PLUGIN_META.*?PLUGIN_META\s*-->/m, "")
    end

    def generate(site)
      dest_dir = File.join(site.source, "_includes", "readmes")
      FileUtils.mkdir_p(dest_dir)

      PLUGINS.each do |repo, branch|
        url = URI("https://raw.githubusercontent.com/mykaadev/#{repo}/#{branch}/README.md")
        puts "↳ Fetching #{repo} README…"

        begin
          response = Net::HTTP.get_response(url)
          unless response.is_a?(Net::HTTPSuccess)
            Jekyll.logger.warn "README not found for #{repo} (HTTP #{response.code}) – skipping."
            next
          end

          content = response.body.force_encoding("UTF-8")
          content = remove_gh_only_sections(content)
          content = remove_meta_blocks(content)
          content << "\n\n---\n\n> [⬇ Download on GitHub](https://github.com/mykaadev/#{repo})"

          File.write(File.join(dest_dir, "#{repo}.md"), content.strip)
        rescue StandardError => e
          Jekyll.logger.warn "Error fetching #{repo}: #{e.message}"
          next
        end
      end
    end
  end
end
