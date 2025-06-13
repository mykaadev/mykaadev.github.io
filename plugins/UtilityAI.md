---
layout: plugin
title: "Utility AI"
thumbnail: "/resources/images/plugins/UtilityAI.png"
short-description: "Dynamic decision-making"
description: "Utility AI is a decision-making framework where each possible *Action* is evaluated by multiple *Considerations*."
---

## Overview

Utility AI is a decision-making framework for Unreal Engine agents where each possible *Action* is evaluated by multiple *Considerations*, producing a utility score that determines the best action to execute. 

This approach enables smoother, more emergent behaviors compared to rigid Finite State Machines or tree-based architectures.

## Features

* **Dynamic Scoring**: Evaluate actions at runtime using normalized, curve-mapped consideration scores.
* **Designer-Friendly**: Tune weights and response curves directly in the Unreal Editor.
* **Modular Architecture**: Extendable C++ base classes for custom actions and considerations.

## Installation

1. Clone or download the plugin into your project’s `Plugins/` folder.
2. Open your Unreal project and enable **NsUtilityAI** in Plugins.
3. Restart the editor.

## Getting Started

1. In your AI Actor Blueprint or C++ class, add **`UNsUtilAIBrainComponent`**.
2. Define your custom **`UNsUtilAIAction`** subclasses and assign them to the Brain Component’s **`PossibleActions`** array.
3. Implement **`CalculateScore()`** in each **`UNsUtilAIConsideration`** subclass to sample your game-specific data.
4. Call **`Think()`** from our brain component whenever you need the AI to evaluate and execute any given action.

## Usage Example

### Shooter Enemy

An enemy AI has four actions:

* **Attack Player**
* **Reload Weapon**
* **Find Cover**
* **Retreat**

Each action contains relevant considerations:

| Action        | Considerations                                      |
| ------------- | --------------------------------------------------- |
| Attack Player | Player in sight, Ammo level, Health above threshold |
| Reload Weapon | Ammo empty, Safe to reload                          |
| Find Cover    | Nearby cover points, Under fire                     |
| Retreat       | Health critically low, No cover available           |

Depending on scores, the highest-scoring action is selected each evaluation, allowing responsive, context-sensitive behavior without hard-coded transitions.

```cpp
void UNsUtilAIBrainComponent::Think()
{
    // Each time Think() runs, we re-evaluate all possible actions
    ChooseAction(PossibleActions);

    // Automatically execute the action
    if (BestAction != nullptr && GetOwner() != nullptr)
    {
        BestAction->ExecuteAction(GetOwner());
    }
}
```

## API Reference

### UNsUtilAIBrainComponent

* **ChooseAction()**: Scores and selects the highest utility action.
* **ScoreAction()**: Aggregates consideration scores with tempering.
* **GetBestAction()**: Returns the last chosen action.

### UNsUtilAIConsideration

* **CalculateScore_Implementation()**: Override to supply raw score [0,1].
* **GetScore()**: Clamps and evaluates the raw score against the response curve.

### UNsUtilAIAction

* **SetScore(float)**: Stores normalized utility value.
* **ExecuteAction_Implementation()**: Override to define action execution.

## Editor Integration

* Add **PossibleActions** in your Brain Component details.
* For each Consideration, adjust the **Response Curve** to shape decision sensitivity.

## FAQ

**Q:** *Can Utility AI replace Behavior Trees?*

**A:** It complements them. Use Utility AI for high-level decision making and Behavior Trees for action execution sequences when needed.

---

> **Download**: [Github](https://www.github.com/mykaadev/NsUtilityAI)


