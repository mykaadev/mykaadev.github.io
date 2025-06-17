## 👀 Summary
NsTwee is a small yet powerful tweening framework for Unreal Engine. It allows smooth interpolation of floats, vectors and quaternions using a rich set of easing functions. Tweens can be controlled entirely through C++ or Blueprint nodes.

## 📦 Features
- **Multiple data types**: Tween `float`, `vector`, `vector2D`, `rotator` and `quaternion` values.
- **Custom easing**: Choose from many easing curves or drive interpolation via a user supplied curve.
- **Looping and yo-yo**: Built-in looping, delays and yo-yo behaviour with callbacks.
- **Blueprint actions**: Async Blueprint nodes for quick setup without code.
- **Subsystem based**: A game instance subsystem updates active tweens automatically.
- **Capacity control**: Reserve tween instances up front to avoid runtime allocations.

## ⚙️ Requirements
Unreal Engine 5.2+

## 🛠️ Installation
1. **Clone** or download this repository.
2. Copy the `NsTween` folder into your project's `Plugins` directory.
3. Generate project files and enable the plugin when prompted.

## 🔧 API
### Key Classes
- `NsTweenCore` – static helpers to play tweens in C++.
- `UNsTweenSubsystem` – automatically ticks and manages active tweens.
- `UNsTweenAsyncAction` – base class for asynchronous Blueprint tween nodes.
- `UNsTweenBlueprintLibrary` – utility functions including `Ease` helpers.

### Main Functions
- `NsTweenCore::Play` – start a tween in C++ for various types.
- `UNsTweenAsyncActionFloat::TweenFloat` – Blueprint node to tween a float value.
- `UNsTweenAsyncActionVector::TweenVector` – Blueprint node to tween vectors.
- `NsTweenInstance` – represents a single tween instance with control methods.




---

> [⬇ Download on GitHub](https://github.com/mykaadev/NsTween)