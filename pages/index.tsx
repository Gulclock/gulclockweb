import React from 'react';
import {
  SettingFilled,
  ReloadOutlined,
  CloseOutlined,
  FireTwoTone,
  RocketTwoTone,
  TrophyTwoTone,
  HourglassTwoTone,
} from '@ant-design/icons';

import styles from '../styles/Home.module.css';

/**
 *  TYPES
 */

type BulletOptions = '1+0' | '2+1';
type BlitzOptions = '3+0' | '3+2' | '5+0' | '5+3';
type RapidOptions = '10+0' | '10+5' | '15+10';
type ClassicalOptions = '30+0' | '30+20';

type TransformPlayMode = {
  name: AllTypesOptions;
  type: BaseOptions['type'];
};

type ListPlayMode = TransformPlayMode[];

type AllTypesOptions =
  | BulletOptions
  | BlitzOptions
  | RapidOptions
  | ClassicalOptions;

type BaseOptions = {
  timeLeft: number;
  increment: number;
  type: 'Bullet' | 'Blitz' | 'Rapid' | 'Classical';
};

type PlayMode = {
  [k in AllTypesOptions]: BaseOptions;
};

type Player = {
  steps: number;
  timeLeft: number;
  paused: boolean;
  increment: number;
};

/**
 *  TYPES END
 */

/**
 * HELPERS AND CONSTS
 */

const playMode: PlayMode = {
  '1+0': { timeLeft: 60, increment: 0, type: 'Bullet' },
  '2+1': { timeLeft: 120, increment: 1, type: 'Bullet' },
  '3+0': { timeLeft: 180, increment: 0, type: 'Blitz' },
  '3+2': { timeLeft: 180, increment: 2, type: 'Blitz' },
  '5+0': { timeLeft: 300, increment: 0, type: 'Blitz' },
  '5+3': { timeLeft: 300, increment: 3, type: 'Blitz' },
  '10+0': { timeLeft: 600, increment: 0, type: 'Rapid' },
  '10+5': { timeLeft: 600, increment: 5, type: 'Rapid' },
  '15+10': { timeLeft: 900, increment: 10, type: 'Rapid' },
  '30+0': { timeLeft: 1800, increment: 0, type: 'Classical' },
  '30+20': { timeLeft: 1800, increment: 20, type: 'Classical' },
};

const usePrevious = (value: BaseOptions | undefined) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const listPlayMode = (arreglo: PlayMode): ListPlayMode => {
  const transform: AllTypesOptions[] = Object.keys(arreglo) as Array<
    keyof typeof arreglo
  >;
  const result = transform.map((item) => ({
    name: item,
    type: arreglo[item].type,
  }));
  return result;
};

const iconsType = {
  Bullet: <RocketTwoTone twoToneColor="#52c41a" />,
  Rapid: <HourglassTwoTone twoToneColor="#52c41a" />,
  Blitz: <FireTwoTone twoToneColor="#52c41a" />,
  Classical: <TrophyTwoTone twoToneColor="#52c41a" />,
};

const initialState = {
  steps: 0,
  timeLeft: 180,
  increment: 2,
  paused: true,
};

/**
 * HELPERS AND CONSTS END
 */

export default function App(): JSX.Element {
  /**
   * THIS IS ALL STATE OF THIS GAME
   */
  /**
   * @description this is the mode of the game like rapid o classical
   */
  const [activeMode, setActiveMode] = React.useState({
    playmode: playMode['3+2'],
    mode: '3+2',
  });

  /**
   * @description this is the state of the player 1
   */
  const [playerTopOrLeft, setPlayerTopOrLeft] = React.useState<Player>(
    initialState
  );

  /**
   * @description this is the state of the player 2
   */
  const [playerBottomOrRight, setPlayerBottomOrRight] = React.useState<Player>(
    initialState
  );

  /**
   * @description this is when the game is over
   */
  const [gameOver, setGameOver] = React.useState<boolean>(false);

  /**
   * @description this is for the settings screen
   */
  const [show, setShow] = React.useState(false);

  /**
   * THIS IS ALL STATE OF THIS GAME END
   */

  /**
   * @description this is the copy of the previus config
   */
  const activeModePrevius = usePrevious(activeMode.playmode);

  /**
   *
   * @description this is the function for player 2
   */

  const startplayerBottomOrRight = () => {
    if (!playerTopOrLeft.paused && playerTopOrLeft.steps > 0) return;
    setPlayerTopOrLeft({
      ...playerTopOrLeft,
      paused: false,
      steps: playerTopOrLeft.steps + 1,
    });
    setPlayerBottomOrRight({
      ...playerBottomOrRight,
      paused: true,
      timeLeft:
        playerBottomOrRight.steps === 0
          ? playerBottomOrRight.timeLeft
          : playerBottomOrRight.timeLeft + playerBottomOrRight.increment,
    });
  };

  /**
   *
   * @description this is the function for player 1
   */

  const startPlayerTopOrLeft = () => {
    if (!playerBottomOrRight.paused && playerBottomOrRight.steps > 0) return;
    setPlayerBottomOrRight({
      ...playerBottomOrRight,
      paused: false,
      steps: playerBottomOrRight.steps + 1,
    });
    setPlayerTopOrLeft({
      ...playerTopOrLeft,
      paused: true,
      timeLeft:
        playerTopOrLeft.steps === 0
          ? playerTopOrLeft.timeLeft
          : playerTopOrLeft.timeLeft + playerTopOrLeft.increment,
    });
  };

  const reset = () => {
    setPlayerBottomOrRight(initialState);
    setPlayerTopOrLeft(initialState);
    setGameOver(false);
  };

  const toggleShow = () => {
    setShow((t) => !t);
  };

  const formatterTime = (time: number) =>
    new Date(time * 1000).toISOString().substr(14, 5);

  const generatorOption = (type: AllTypesOptions): void => {
    setActiveMode({ playmode: playMode[type], mode: type });
  };

  React.useEffect(() => {
    const id = setInterval(() => {
      setPlayerTopOrLeft({
        ...playerTopOrLeft,
        timeLeft: playerTopOrLeft.timeLeft - 1,
      });
    }, 1000);
    if (playerTopOrLeft.timeLeft === 0) {
      clearInterval(id);
      setGameOver(true);
    }
    if (playerTopOrLeft.paused) {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [playerTopOrLeft, playerTopOrLeft.paused]);

  React.useEffect(() => {
    const id = setInterval(() => {
      setPlayerBottomOrRight({
        ...playerBottomOrRight,
        timeLeft: playerBottomOrRight.timeLeft - 1,
      });
    }, 1000);
    if (playerBottomOrRight.timeLeft === 0) {
      clearInterval(id);
      setGameOver(true);
    }
    if (playerBottomOrRight.paused) {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [playerBottomOrRight, playerBottomOrRight.paused]);

  React.useEffect(() => {
    if (activeModePrevius !== activeMode.playmode) {
      reset();
    }
  }, [activeMode]);

  return (
    <div className={styles.container}>
      <button
        disabled={gameOver}
        className={styles.player}
        style={{
          backgroundColor:
            playerTopOrLeft.timeLeft === 0
              ? 'red'
              : playerTopOrLeft.paused
              ? '#c0c0c0'
              : 'darkorange',
        }}
        onClick={startPlayerTopOrLeft}
      >
        {formatterTime(playerTopOrLeft.timeLeft)}
        <p style={{ position: 'absolute', right: 15, bottom: 15 }}>
          {playerTopOrLeft.steps}
        </p>
      </button>
      <div className={styles.settings}>
        <ReloadOutlined
          onClick={reset}
          style={{ color: 'white', fontSize: '30px' }}
        />
        <SettingFilled
          onClick={toggleShow}
          style={{ color: 'white', fontSize: '30px' }}
        />
      </div>
      <button
        disabled={gameOver}
        className={styles.player}
        style={{
          backgroundColor:
            playerBottomOrRight.timeLeft === 0
              ? 'red'
              : playerBottomOrRight.paused
              ? '#c0c0c0'
              : 'darkorange',
        }}
        onClick={startplayerBottomOrRight}
      >
        {formatterTime(playerBottomOrRight.timeLeft)}
        <p style={{ position: 'absolute', right: 15, bottom: 15 }}>
          {playerBottomOrRight.steps}
        </p>
      </button>
      <div
        className={show ? `${styles.setting} ${styles.show}` : styles.setting}
      >
        <header>
          <h2>Settings</h2> <CloseOutlined onClick={toggleShow} />
        </header>
        <ul>
          {listPlayMode(playMode).map((item) => (
            <li
              style={{
                backgroundColor:
                  activeMode.mode === item.name
                    ? 'rgba(255,255,255,.2)'
                    : '#000',
              }}
              onClick={() => generatorOption(item.name)}
            >
              <p>{iconsType[item.type]}</p>
              <p style={{ margin: '0px 10px' }}> {item.type} </p>
              <p>{item.name}</p>
              {activeMode.mode === item.name && (
                <p style={{ marginLeft: 'auto', color: 'greenyellow' }}>✓</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
