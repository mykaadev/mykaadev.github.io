## 👀 Summary
NsTween is a small yet powerful tweening framework for Unreal Engine. It allows smooth interpolation of floats, vectors and quaternions using a rich set of easing functions. Tweens can be controlled entirely through C++ or Blueprint nodes.

<div align="center">
 <img src="https://raw.githubusercontent.com/mykaadev/NsTween/refs/heads/main/Resources/SupportedCurvesRow.png" alt="NsTween" width="750">
</div>

## 📦 Features
- **Multiple data types**: `Float`, `Vector`, `Vector2D`, `Rotator`, `Quaternion`, `Transform` and `Color` values.
- **Custom easing**: Choose from many easing curves or drive interpolation via a user supplied curve.
- **Warp mode**: Built-in `Looping`, `Delays` and `Ping-Pong` behaviours.
- **Direction**: Chose between `Forward` or `Backward`
- **Blueprint actions**: Async Blueprint nodes for quick setup without code.
- **Subsystem based**: A Subsystem to handle all the active tweens.
- **Tween-To-Tween Injection**: Inject any different tween behaviour at any time into your current tween.

## ⚙️ Requirements
Unreal Engine 5.2+

## 🛠️ Installation
1. **Clone** or download this repository.
2. Copy the `NsTween` folder into your project's `Plugins` directory.
3. Generate project files and enable the plugin when prompted.

## 🚀 Getting Started
Below is a minimal C++ example showing how to move an actor along the X axis using the fluent tween helpers built into `FNsTween`:

```cpp
#include "NsTween.h"

void AMyActor::BeginPlay()
{
    Super::BeginPlay();

    FNsTween::Play(
        /**Start*/   0.f,
        /**End*/     100.f,
        /**Time*/    2.f,
        /**Ease*/    ENsTweenEase::InOutQuad,
        /**Update*/  [this](float Value)
        {
            SetActorLocation(FVector(Value, 0.f, 0.f));
        });
}
```

The library also exposes Blueprint nodes for the same functionality if you prefer a visual approach.
Below is a slightly more advanced snippet showing how to make an item float up and down while spinning for 10 complete loops

```cpp
#include "NsTween.h"

void AFloatingItem::BeginPlay()
{
    Super::BeginPlay();

    // Float continuously
    FNsTween::Play(
         /**Start*/   GetActorLocation().Z,
         /**End*/     GetActorLocation().Z + 40.f,
         /**Time*/    1.f,
         /**Ease*/    ENsTweenEase::InOutSine,
         /**Update*/  [this](float Z)
        {
            FVector CurrentLocation = GetActorLocation();
            CurrentLocation.Z = Z;
            SetActorLocation(CurrentLocation);
        })
        .SetPingPong(true)
        .SetLoops(-1); // infinite loops


    // Rotate and print 10 times the Loop
    FNsTween::Play(
        /** Start  */  0.f,
        /** End    */  360.f,
        /** Time   */  2.f,
        /** Ease   */  ENsTweenEase::Linear,
        /** Update */  [this](float Yaw)
        {
            SetActorRotation(FRotator(0.f, Yaw, 0.f));
        })
        .SetLoops(10) // 10 full spins
        .OnLoop([this]()
        {
            UE_LOG(LogTemp, Warning, TEXT("Spin finished"));
        });
}
```


## 🚩 Road Map
<div align="center">
 <img src="https://raw.githubusercontent.com/mykaadev/NsTween/refs/heads/main/Resources/RoadMap.png" alt="NsTween" width="750">
</div>


## 🔧 API
### Runtime Core
- `FNsTween` – Runtime tween state tracking easing, wrap modes, delegates, and pause behavior.
- `FNsTweenBuilder` – Fluent setup handle chaining specs, callbacks, activation, and control forwarding.
- `UNsTweenSubsystem` – Game-instance subsystem ticking live tweens, processing commands, and allocating easing curves.

### Data & Specs
- `FNsTweenSpec` / `FNsTweenCommand` / `FNsTweenHandle` – Blueprint-ready structs describing playback options, delegate hooks, queued commands, and handles.
- `UNsTweenSequence` – UObject sequence asset storing ordered tween specs for content-driven playback.

### Blueprint & Async Surface
- `UNsTweenBlueprintLibrary` – Central Blueprint library spawning tweens, exposing ease presets, and forwarding subsystem controls.
- `UNsTweenAsyncAction` (base) – Shared async action base normalizing inputs, binding events, and managing lifecycle cleanup.
- Typed async nodes – Float, vector, rotator, transform, and color broadcasts with curve overrides.

### Strategies & Helpers
- Callback strategy / interpolators – Lambda-friendly callback strategies and templated interpolators supplying type-appropriate lerp math.
- Native value strategies – Native ITweenValue implementations initializing targets, applying eased updates, and ensuring completion.

### Easing Implementations
- `FNsTweenPolynomialEasing` – Polynomial easing evaluator covering sine, expo, elastic, bounce, and back presets.
- `FNsTweenBezierEasing` – Cubic Bezier easing solver inverting time with Newton steps before sampling output.
- `FNsTweenCurveAssetEasingAdapter` – Adapter wrapping UCurveFloat assets to drive easing while falling back gracefully.

## 🧭 Tech Documentation Layout
Use the following map when you need to dive deeper than the high-level feature overview. Each entry mirrors the folder layout inside the plugin so you can jump straight from prose into the exact file that owns the logic.

### Public Surface
- [`Source/NsTween/Public/NsTween.h`](Source/NsTween/Public/NsTween.h) &mdash; contains `FNsTween::Play` and the templated `BuildT<T>` helpers that every example in the docs references.
- [`Source/NsTween/Public/NsTweenTypeLibrary.h`](Source/NsTween/Public/NsTweenTypeLibrary.h) &mdash; enums, delegates, and light-weight structs used across the tutorials.
- [`Source/NsTween/Public/Interfaces/ITweenValue.h`](Source/NsTween/Public/Interfaces/ITweenValue.h) &mdash; the strategy contract implemented by each type-specific value driver.
- [`Source/NsTween/Public/Templates/`](Source/NsTween/Public/Templates) &mdash; header-only interpolators and callback strategies.

### Runtime Flow
- [`Source/NsTween/Private/NsTween.cpp`](Source/NsTween/Private/NsTween.cpp) &mdash; documents the lifetime of an active tween, including pause/cancel semantics and wrap modes.
- [`Source/NsTween/Private/NsTweenBuilder.cpp`](Source/NsTween/Private/NsTweenBuilder.cpp) &mdash; shows how specs become runtime objects before entering the subsystem.
- [`Source/NsTween/Private/NsTweenSubsystem.cpp`](Source/NsTween/Private/NsTweenSubsystem.cpp) &mdash; central tick loop and allocation strategy for live tweens




---

> [⬇ Download on GitHub](https://github.com/mykaadev/NsTween)