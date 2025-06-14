---
layout: plugin
title: "Utility AI"
thumbnail: "https://raw.githubusercontent.com/mykaadev/NsUtilityAI/refs/heads/main/Resources/UtilityAIBanner.png"
short-description: "Dynamic decision-making"
description: "A decision-making framework for Unreal Engine agents where every possible action is evaluated by a set of considerations. The resulting utility score selects which action to execute"
---

## 👀 Summary
Utility AI is a decision-making framework for Unreal Engine agents where each possible *Action* is evaluated by multiple *Considerations*, producing a utility score that determines the best action to execute. 

This approach enables smoother, more emergent behaviors compared to rigid Finite State Machines or tree-based architectures.

## ❓ What is Utility AI?
Utility AI evaluates many potential actions and ranks them based on their desirability. Each action gathers scores from considerations (for example health, distance or ammo) and the highest score wins. This approach results in more nuanced behaviour than simple state machines or behaviour trees.

### When to use it
- When your agent needs to consider multiple factors for decision making.
- When you want dynamic behaviour without lengthy condition chains.
- When prototyping quick AI logic in Blueprints.

### Why is it good?
- Scales easily as you add more considerations.
- Designers can tweak curves to influence behaviour without coding.
- Works entirely in C++ and Blueprints for flexibility.

## 📦 Features
- **Designer-Friendly**: Tune weights and response curves directly in the Unreal Editor.
- **Modular Architecture**: Extendable C++ base classes for custom actions and considerations.
- **Simple API** that can be extended to fit any project.
- **Blueprint-ready components** for actions and considerations.
- **Brain Component** to select and execute the best action.
- **Custom response curves** for considerations.

## ⚙️ Requirements
Unreal Engine 5.2+

## 🛠️ Installation
1. **[Download](https://github.com/mykaadev/NsUtilityAI/releases)** the latest release.
2. Extract the archive into your project's `Plugins` folder: `.../UEGame/Plugins/NsUtilityAI`.
3. Add the plugin to your `UEGame.uproject` and generate project files.
4. Open the project and enable **NsUtilityAI** if prompted.

## 🔧 Usage / API Reference
### Key Classes
- `UNsUtilAIBrainComponent` – attach to an actor and call **Think** to evaluate actions.
- `UNsUtilAIAction` – base class for actions. Override **ExecuteAction** and provide **Considerations**.
- `UNsUtilAIConsideration` – base class for scoring logic with a customizable curve.

### Main Functions
- `Think()` – evaluates `PossibleActions`, runs the best scoring action.
- `ThinkAndReact()` – evaluates `PossibleActions`, and executes the best action.
- `ChooseAction` – given an array of actions, selects the highest scoring one.
- `ScoreAction` – multiplies consideration scores to produce an action utility value.
- `ExecuteAction` – override in your action subclass to perform behaviour.
- `CalculateScore` – override in a consideration to return a raw 0‑1 score.
- `GetBestAction` – returns the action chosen by the last call to **Think**.

### Getting Started
1. In your AI actor, add **`UNsUtilAIBrainComponent`**.
2. Create custom **`UNsUtilAIAction`** subclasses and assign them to the Brain Component’s **`PossibleActions`** array.
3. Implement **`CalculateScore()`** in each **`UNsUtilAIConsideration`** to read your game data.
4. For each Consideration, adjust the **Response Curve** to shape decision sensitivity and assign it to the action that you want..
5. Call **`ThinkAndReact()`** whenever the AI should evaluate and execute an action.

### Shooter Enemy Example

An enemy might provide actions like:

* **Attack Player**
* **Reload Weapon**
* **Find Cover**
* **Retreat**

Each action is scored by its considerations:

| Action | Considerations |
| --- | --- |
| Attack Player | Player in sight, Ammo amount, Health percentage |
| Reload Weapon | Ammo amount, Safe to reload |
| Find Cover | Nearby cover points, Under fire |
| Retreat | Health critically low, No cover available |

### C++ Example

```cpp
// Actor with brain component
AMyBot::AMyBot()
{
    Brain = CreateDefaultSubobject<UNsUtilAIBrainComponent>(TEXT("Brain"));
}

void AMyBot::BeginPlay()
{
    if (Brain != nullptr)
    {
        Brain->ThinkAndReact(); // Chose the best action and execute it
    }
}

// Custom consideration
UCLASS()
class UHealthConsideration : public UNsUtilAIConsideration
{
    GENERATED_BODY()

public:
    virtual float CalculateScore_Implementation(AActor* InOwner) const override
    {
        if (const AMyBot* const Bot = Cast<AMyBot>(InOwner))
        {
            const float HealthScore = Bot->GetCurrentHealth() / Bot->GetMaxtHealth(); 
            return HealthScore;
        }
    }
};

// Custom action
UCLASS()
class UAttackAction : public UNsUtilAIAction
{
    GENERATED_BODY()

    virtual void ExecuteAction_Implementation(AActor* InActor) override
    {
        UE_LOG(LogTemp, Log, TEXT("Firing at player"));
    }
};
```

## FAQ

**Q:** *Can Utility AI replace Behavior Trees?*

**A:** It complements them. Use Utility AI for high-level decision making and Behavior Trees for action execution sequences when needed.

---

> **Download**: [Github](https://www.github.com/mykaadev/NsUtilityAI)


