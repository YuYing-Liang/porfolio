import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import type Phaser from "phaser";
import { StartGame } from "./main";
import { EventBus } from "./EventBus";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

const PhaserGame = forwardRef<IRefPhaserGame, object>(function PhaserGame({}, ref) {
  const game = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    if (game.current === null) {
      game.current = StartGame("game-container");

      if (typeof ref === "function") {
        ref({ game: game.current, scene: null });
      } else if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        if (game.current !== null) {
          game.current = null;
        }
      }
    };
  }, [ref]);

  useEffect(() => {
    EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
      // if (currentActiveScene && typeof currentActiveScene === "function") {
      //   currentActiveScene(scene_instance);
      // }

      if (typeof ref === "function") {
        ref({ game: game.current, scene: scene_instance });
      } else if (ref) {
        ref.current = { game: game.current, scene: scene_instance };
      }
    });
    return () => {
      EventBus.removeListener("current-scene-ready");
    };
  }, [ref]);

  return <div id="game-container"></div>;
});

export function Game() {
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  return <PhaserGame ref={phaserRef} />;
}