import React from "react";

import {
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  CannonJSPlugin,
  PhysicsImpostor
} from "@babylonjs/core";

import { GridMaterial } from "@babylonjs/materials";

import { SceneComponent } from "../scene";

import * as CANNON from "cannon";

import styles from "./game.module.css";

window.CANNON = CANNON;


let BOXES = [
  { x: -10, y: 3, z: -10 },
  { x: 10, y: 3, z: 10 },
  { x: -10, y: 3, z: 10 },
  { x: 10, y: 3, z: -10 },
];

var cannonfoot, cannontube;
var itarg;

function GameScene() {

  const onSceneReady = (scene, engine, url) => {

    const canvas = scene.getEngine().getRenderingCanvas();

    let camera = new ArcRotateCamera(
      "camera1",
      -Math.PI / 2,
      1.2,
      50,
      new Vector3(0, 0, 0),
      scene
    );
    camera.lowerRadiusLimit = 20; // min zoom
		camera.upperRadiusLimit = 100; // max zoom
		camera.lowerBetaLimit = 0.2;
		camera.upperBetaLimit = 1.2;
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    let light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.8;


    // Our built-in 'ground' shape.
    let ground = MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, scene); // create a ground by passing width and height
    ground.material = new GridMaterial("groundMaterial", scene); // creating a grid material and assigning it as material for ground

    scene.enablePhysics(null, new CannonJSPlugin());

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9 },
      scene
    );

    createBoxs(BOXES)

    //We add the base of the tank (Cube)
    cannonfoot = MeshBuilder.CreateBox(
      "Foot",
      { width: 4, height: 2, depth: 3 },
      scene
    );
    cannonfoot.position.set(0, 1, 20);
    cannonfoot.rotation.set(0, 3.1, 0);

    //We put the barrel of the tank (Cylinder)
    cannontube = MeshBuilder.CreateCylinder(
      "Tube",
      { height: 5, diameter: 1, tessellation: 64 },
      scene
    );
    cannontube.position.set(0, 1.5, 2);

    //This cube will work as a shooting guide
    itarg = MeshBuilder.CreateBox("targ", { size: 1}, scene);
    itarg.position.y = 10;
    itarg.visibility = 0.3; //semitransparent
    itarg.parent = cannontube; //Defined as a child component of the barrel

    cannontube.rotation.set(1.5, 0, 0);
    cannontube.parent = cannonfoot; //Defined as a child component of the barrel base

    // scene.debugLayer.show();
  };


  const createBoxs = (boxes, scene) => {
    let matBox = new StandardMaterial("matBox3", scene);
    matBox.diffuseTexture = new Texture("textures/crate.png", scene);
    
    boxes.forEach((item, i) => {
      let box = MeshBuilder.CreateBox(
        `Box${i}`,
        { size: 3, width: 3, height: 3, depth: 3 },
        scene
      );
      box.material = matBox;
      box.position.set(item.x, item.y, item.z);
      box.physicsImpostor = new PhysicsImpostor(
        box,
        PhysicsImpostor.BoxImpostor,
        { mass: 0.2, friction: 0.5, restitution: 0.9 },
        scene
      );
    });
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
