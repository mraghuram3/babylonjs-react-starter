import React from "react";

import {
    FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder
} from "@babylonjs/core";

import { SceneComponent } from "../scene";

import * as CANNON from "cannon";

import styles from "./game.module.css";

window.CANNON = CANNON;



function GameScene() {

  const onSceneReady = (scene, engine, url) => {

    const canvas = scene.getEngine().getRenderingCanvas();

    let camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    let light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    let sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    let ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    // scene.debugLayer.show();
  };

  
  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  const onRender = (scene, engine) => {};

  return (
    <div className={styles.parent}>
      <SceneComponent
        antialias
        onSceneReady={(scene, engine) => {
          onSceneReady(scene, engine);
        }}
        onRender={(scene, engine) => {
          onRender(scene, engine);
        }}
        id="my-canvas"
      />
    </div>
  );
}

export { GameScene };