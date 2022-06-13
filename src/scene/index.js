import { Engine, Scene } from "@babylonjs/core";
import React, { useEffect, useRef } from "react";

export function SceneComponent(props) {
  const reactCanvas = useRef(null);
  const {
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    onSceneResize,
    ...rest
  } = props;

  useEffect(function onMount() {
    let element = document.getElementById(props.id);
    element.addEventListener("wheel", onMouseWheel);
    element.addEventListener("mousewheel", onMouseWheel);
    return function unMount() {
      element.removeEventListener("wheel", onMouseWheel);
      element.removeEventListener("mousewheel", onMouseWheel);
    };
  }, []);

  const onMouseWheel = (e) => {
    e?.preventDefault();
  };

  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new Engine(
        reactCanvas.current,
        antialias,
        engineOptions,
        adaptToDeviceRatio
      );
      const scene = new Scene(engine, sceneOptions);
      if (scene.isReady()) {
        props.onSceneReady(scene, engine);
      } else {
        scene.onReadyObservable.addOnce((scene) =>
          props.onSceneReady(scene, engine)
        );
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === "function") {
          onRender(scene, engine);
        }
        scene.render();
      });

      const resize = (e) => {
        scene.getEngine().resize();
        onSceneResize && onSceneResize(e);
      };

      if (window) {
        window.addEventListener("resize", resize);
      }

      return () => {
        scene.getEngine().dispose();

        if (window) {
          window.removeEventListener("resize", resize);
        }
      };
    }
  }, [reactCanvas]);

  return (
    <div id="canvasZone">
      <canvas
        ref={reactCanvas}
        {...rest}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
}
