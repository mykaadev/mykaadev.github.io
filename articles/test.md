---
layout: default
title: test Article
---

An overview of Mesh Distance Fields and its available features that you can use when developing your games.

![Mesh Distance Fields](https://dev.epicgames.com/community/api/documentation/image/e901575d-3e06-4775-a34a-6a07fb9d021c?resizing_type=fit&width=1920&height=335)

**Unreal Engine** leverages the power of **Distance Fields** to have dynamic ambient occlusion and shadowing for Static Mesh Actors in your games. In addition to that, the Mesh Distance Field representation of an Actor can be used for other features like GPU particle collision or even with the Material Editor to create dynamic flow maps and much more.

Continue reading below to learn how Mesh Distance Fields work and some of the ways you can use it in your games.

## How does it work?

To represent a Static Mesh's surfaces, a **Signed Distance Field** (SDF) is used. It works by storing the distance to the nearest surface in a volume texture. For every point on the exterior of the mesh is considered positive distance and any point inside the mesh stores a negative distance. In the example below, the positive distances are being traced and stored to represent the tree later on.

![Example of the storing distance to the nearest surface](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/56136f31-5db8-4e32-8dc1-9a572ad97481/01-distance-field-positive-distance-tracing.png)

The first property of SDF that make them useful is that when tracing a ray, you can safely skip through empty space as the distance to the nearest surface is already known (this is sometimes called Sphere Tracing). This allows the intersections to be determined with a small number steps. By ray tracing a distance field, a visibility result is produced, meaning that if the ray intersects the mesh, the light will then be shadowed.

![Example of the sphere tracing principle](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/dd59865f-086c-45a2-bb2d-388d7aa8394c/02-distance-field-sphere-tracing.png)

The second property that makes SDF useful is that when you trace a ray, by tracking the closest distance a ray passed by an occluding object, an approximate cone intersection can be computed with no extra cost. This approximation makes it possible to do very soft area shadows and sky occlusion using distance fields. This property is key to features like [Distance Field Ambient Occlusion](https://dev.epicgames.com/documentation/en-us/unreal-engine/distance-field-ambient-occlusion-in-unreal-engine) as a small number of cones can compute a soft visibility for the entire hemisphere of a receiver point.

![Example of the tracking the closest distance a ray passed by an occluding object](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/d7878096-84da-4e4b-b38f-47e9ab8b80b2/03-distance-field-cone-tracing.png)

You can read further about [using Distance Fields for Lighting](http://iquilezles.org/www/articles/raymarchingdf/raymarchingdf.htm) here.

## Scene Representation

Each level that you create is made up of all these Mesh Distance Fields for your placed Actors. When Mesh Distance Fields are generate, they are done so "offline" using triangle raytracing that stores the results in a volume texture. Because of this, mesh distance field generation cannot be done at runtime. This method computes the Signed Distance Field rays in all directions to find the nearest surface and stores that information.

You can visualize the Mesh Distance Fields that represent your scene by using the viewport and selecting **Show > Visualize > Mesh Distance Fields**.

| [![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/99d292b1-fc98-43aa-8c3f-32eff2d3c3f0/04-distance-field-enable-mdf-view-mode.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/99d292b1-fc98-43aa-8c3f-32eff2d3c3f0/04-distance-field-enable-mdf-view-mode.png) | [![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/11d55061-3ed6-4b08-a1de-c6a12636e537/05-distance-field-visualize-mdf.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/11d55061-3ed6-4b08-a1de-c6a12636e537/05-distance-field-visualize-mdf.png) |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Menu to Enable Visualization                                                                                                                                                                                                                                                                  | Mesh Distance Field Visualization                                                                                                                                                                                                                                               |

_Click images for full size._

When you see areas that are more white than gray, it means that many steps were needed to find the intersection of the mesh surface. Rays at grazing angles to surfaces took many more steps to intersect than would have for a simpler mesh.

### Quality

The quality of a Mesh Distance Field representation is controlled by its volume texture resolution. This can be modified using **Distance Field Resolution Scale** in the [Build Settings](https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-distance-fields-properties-in-unreal-engine#buildsettings) of the **Static Mesh Editor**.

[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/f38f2e15-6fd3-440c-b0c5-89a67b7ad071/06-distance-field-build-settings.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/f38f2e15-6fd3-440c-b0c5-89a67b7ad071/06-distance-field-build-settings.png)

Click image for full size.

The Mesh Distance Field quality will be best for levels that are built out of meshes with similar size, as large meshes tend to create errors. For example, meshes in [Fortnite](https://www.epicgames.com/fortnite) either conform to a grid or are props placed around parts of the level, which gives the best results with few errors. Landscapes are handled separately by [heightfields](https://dev.epicgames.com/documentation/en-us/unreal-engine/distance-field-ambient-occlusion-in-unreal-engine#landscapes) and are not affected by Distance Field resolution.

|[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/f501d77e-1201-4e30-bf93-024fe2122e56/07-distance-field-mesh.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/f501d77e-1201-4e30-bf93-024fe2122e56/07-distance-field-mesh.png)|[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/135f8513-c976-4a4b-9d04-a9096ea91e6e/08-distance-field-low-resolution.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/135f8513-c976-4a4b-9d04-a9096ea91e6e/08-distance-field-low-resolution.png)|[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/389de318-b0a9-416e-9da8-ba3054b57ec3/09-distance-field-high-resolution.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/389de318-b0a9-416e-9da8-ba3054b57ec3/09-distance-field-high-resolution.png)|
|---|---|---|
|Original Mesh|Resolution is too low, important features are lost|Resolution has been increased, important features represented|

_Click images for full size._

The resolution of your Mesh Distance Field should be adjusted enough to capture the important features. As you increase the resolution of the mesh, the memory footprint of the Mesh Distance Field will increase as well. In the Static Mesh Editor, you can see the Mesh Distance Field size listed on the top left of the Viewport.

[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/b7094cd1-5ebd-4cfe-8100-d8221c410463/10-distance-field-smeditor-dfsize.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/b7094cd1-5ebd-4cfe-8100-d8221c410463/10-distance-field-smeditor-dfsize.png)

Click image for full size.

When the Mesh Distance Field is generated, corners are rounded off based on resolution. This can be offset by increasing its resolution, but in most cases, should not be an issue depending on the complexity of the mesh. The maximum size volume texture any single mesh can have is 8 megabytes with a resolution of 128x128x128.

| ![Rounded corners based on the resolution 1](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/bfe83dc7-bbc8-4c59-9524-943f4262ba35/11-distance-field-quality-corners-1.png) | ![Rounded corners based on the resolution 2](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/f9e0f506-56cd-4626-b540-acf51782508c/12-distance-field-quality-corners-2.png) | ![Rounded corners based on the resolution 3](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/53e4a12c-c5fb-43f4-b7b7-e5c4010bcf11/13-distance-field-quality-corners-3.png) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                                                                                                                                       |                                                                                                                                                                                       |                                                                                                                                                                                       |

For thin surfaces, they can only be represented with a negative texel inside the mesh, which is necessary for finding its root. Increasing the resolution can capture the larger detail more accurately here, but in cases where you're only using [Distance Field Ambient Occlusion](https://dev.epicgames.com/documentation/en-us/unreal-engine/distance-field-ambient-occlusion-in-unreal-engine) and the surfaces aren't represented properly. Occlusion further from the surface will be accurate, so it's often not noticeable with sky occlusion.

![Thin serfaces representation with Mesh Distance Field visualization](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/092f0f93-b1e2-44fd-a486-3ce354d4cce5/14-distance-field-quality-corners-4.png)

### Global Distance Field

The Global Distance Field is a low-resolution Distance Field that uses Signed Distance Fields occlusion in your levels while following the camera. It creates a cache of the per-object Mesh Distance Fields and composites them into a few volume textures centered around the camera, called clipmaps. Only newly visible areas or those affected by the scene modification need to be updated, so composition doesn't cost much.

The lower resolution of the object Distance Field means that it can be used for everything, but when computing cone traces for sky occlusion, they are sampled near the point of being shaded while the Global Distance Field is sampled further away.

You can visualize the Global Distance Field in the viewport by clicking **Show > Visualize > Global Distance Field**.

[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/7a85658b-64a9-4260-a995-78ea10937c44/15-distance-field-enable-gdf-view-mode.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/7a85658b-64a9-4260-a995-78ea10937c44/15-distance-field-enable-gdf-view-mode.png)

Click image for full size.

Below is a comparison of the per-object Mesh Distance Field visualization in comparison to the Global Distance Field visualization that combines them into clipmaps based on the camera view and distance.

![Mesh Distance Fields Visualization](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/d95990ec-7c1b-4208-b516-2ec08a558187/16-distance-field-mdf-visualization.png)

![Global Distance Fields Visualization](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/e6c6930a-5231-472e-8e3c-045ab21e986a/17-distance-field-gdf-visualization.png)

Mesh Distance Fields Visualization

Global Distance Fields Visualization

For more information, visit the [Distance Field Ambient Occlusion](https://dev.epicgames.com/documentation/en-us/unreal-engine/distance-field-ambient-occlusion-in-unreal-engine) page.

### Foliage

Foliage assets can also leverage the Distance Fields making it possible to have dynamic occlusion or even have distance shadowing beyond what Cascaded Shadow Maps can shadow.

Below are some options you should consider when using any foliage assets in your games to get the most out of performance and quality.

#### Two-Sided Distance Field

For high-density meshes (like trees) where you have surface that are usually made up of a masked material that represents many holes for leaves or branches, these cannot adequately be represented as a solid surface. For this reason, you can enable the [Build Setting](https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-distance-fields-properties-in-unreal-engine#buildsettings) for **Two-Sided Distance Field Generation** in the **Static Mesh Editor**. This option will work well for foliage but does come at a higher ray marching cost.

![Enabling the Two-Sided Distance Field](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/f6671e0b-b3fa-4d0c-ad19-d9ab9e6f8ae6/18-distance-field-two-sided-distance-field.png)

Look at the example below. The tree on the left is using a default opaque Mesh Distance Field representation. The one on the right has **Two-Sided Distance Field Generation** enabled. You'll notices that the two-sided mesh distance field is more white than it is gray and the surfaces are now translucent. This means that many more steps were needed to find the intersection of the mesh when generating the volume texture than the opaque one and will come at a higher cost.

|[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/d782e704-90a2-441d-9ead-d93d660cd8d5/19-distance-field-two-sided-on.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/d782e704-90a2-441d-9ead-d93d660cd8d5/19-distance-field-two-sided-on.png)|[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/4c5e320f-33fd-4224-8dc9-6d07b4de5e5d/20-distance-field-two-sided-off.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/4c5e320f-33fd-4224-8dc9-6d07b4de5e5d/20-distance-field-two-sided-off.png)|
|---|---|
|Two-Sided Distance Field Generation Disabled|Two-Sided Distance Field Generation Enabled|

_Click images for full size._

#### Foliage Tool Settings

In the [Foliage Tool](https://dev.epicgames.com/documentation/en-us/unreal-engine/foliage-mode-in-unreal-engine), you must enable each foliage type that you want to use Distance Field lighting features for ambient occlusion and shadowing. By default, this setting is disabled because some foliage assets (like grass) where you would have thousands or tens of thousands of instances would overflow the tile culling buffer. When this happens, you can unsightly artifacts. So, only enable **Affect Distance Field Lighting** for the foliage assets that you need.

[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/c6acaa24-53d8-4f3d-a40b-21f8db537d57/21-distance-field-foliage-tool-settings.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/c6acaa24-53d8-4f3d-a40b-21f8db537d57/21-distance-field-foliage-tool-settings.png)

Click image for full size.

### Enabling Distance Fields

To enable Mesh Distance Fields for your project, click **Edit** on the **Main** menu and select **Project Settings**.

![Open Project Settings](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/9c39ca7d-9fc2-4bed-b20d-60d3db6067b3/22-distance-field-project-settings.png)

Navigate to the **Engine** section and select **Rendering**. Under the **Software Ray Tracing** category, toggle the checkbox next to **Generate Mesh Distance Fields**.

[![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/9d92e30b-7f16-4708-9599-81093407164a/23-distance-field-enable-generate-mesh.png)](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/9d92e30b-7f16-4708-9599-81093407164a/23-distance-field-enable-generate-mesh.png)

Click image for full size.

When you enable this, you will be prompted to restart your project.

![Restart Editor to apply new settings](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/c23f8438-ff74-4411-84a3-967052f1553a/24-distance-field-restarrt-editor-button.png)

Once completed, you can visualize the Mesh Distance Fields in the viewport by clicking **Show** \> **Visualize** \> **Mesh DistanceFields**. You should see a similar view to this.

![Scene View](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/9a4b7cb5-13db-4fac-a7b9-eb3c6e019e93/25-distance-field-triangle-scene.png)

![Mesh Distance Fields Visualization](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/a4d9ac03-6e8d-49ae-81df-ec1d94597a05/26-distance-field-mdf-scene.png)

Scene View

Mesh Distance Fields Visualization

_The entirety of this level is represented by instanced Distance Fields that are stored in volume textures._

### Limitations

**Limitations of the Distance Fields technique:**

- Support for feature level 5 platforms only (DX-11 and above)
    
- Only casts shadows from rigid meshes. For Skeletal Meshes, you can use [Capsule Shadows](https://dev.epicgames.com/documentation/en-us/unreal-engine/capsule-shadows-in-unreal-engine) for indirectly lit areas with Distance Field Ambient Occlusion (DFAO) and soft direct shadowing.
    
- Materials that deform the mesh through World Position Offset or displacement may cause self-shadowing artifacts, as the Distance Field representation is generated offline and does not know about these deformations.
    

**Limitations of the current implementation but can be improved in the future:**

- Non-uniform scaling cannot be handled correctly (although, mirroring is ok). Scaling the mesh by two times or less is not generally noticeable.
    
- Only supports Static Mesh, Instances Static Mesh, Foliage, and Landscape (Heightfield). Foliage must be enabled with **Affect Distance Field Lighting** from the Foliage Tool settings.
    

**Hardware Limitations:**

- All Mesh Distance Field features have been disabled on Intel cards because the HD 4000 hangs in the RHICreateTexture3D call to allocate the large atlas.

### References

- [Quilez,Inigo. "Raymarching Distance Fields." N.p, 2008](http://iquilezles.org/www/articles/raymarchingdf/raymarchingdf.htm)