import './App.css';
import { useEffect, useRef, useState } from 'react';
import { setupCanvas } from './canvas/setupCanvas';
import tanks from './data/Tank';
import GameSense from './components/gameSense';

function App() {
  const [mode, setMode] = useState('story');
  const [playerName, setPlayerName] = useState('');
  const [selectedTank, setSelectedTank] = useState('kyuubi');
  const [screenState, setScreenState] = useState('lobby');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const canvasRef = useRef(null);
  

  const leftPlayers = ['Đại Thánh', 'Đại Nguyên', 'Strike', 'Star-Lord', 'Gundam'];
  const rightPlayers = ['truongdeath', 'andead', 'Phuccover', 'mark jackson', 'hoangduong'];
  const selectedTankData = tanks.find((tank) => tank.id === selectedTank);

  useEffect(() => {
    if (screenState !== 'game' || !canvasRef.current) {
      return undefined;
    }

    const cleanup = setupCanvas(canvasRef.current, selectedTank, mode);
    return cleanup;
  }, [screenState]);

  useEffect(() => {
    if (screenState !== 'loading') {
      return undefined;
    }

    const loadingDuration = 200;
    let animationFrameId = 0;
    let startTime = null;

    const updateProgress = (time) => {
      if (startTime === null) {
        startTime = time;
      }

      const elapsed = time - startTime;
      const nextProgress = Math.min(100, Math.round((elapsed / loadingDuration) * 100));
      setLoadingProgress(nextProgress);

      if (nextProgress >= 100) {
        setScreenState('game');
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateProgress);
    };

    animationFrameId = window.requestAnimationFrame(updateProgress);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [screenState]);

  


  const startGame = () => {
    if (!playerName.trim()) {
      return;
    }

    setLoadingProgress(0);
    setScreenState('loading');
  };

  const selectTank = (tank) => {
    setSelectedTank(tank);
  };

  return (
    <div className="App">
      <canvas id="gameCanvas" ref={canvasRef} className={screenState === 'game' ? 'game-canvas active' : 'game-canvas'} />
      
      {screenState === 'game' && <GameSense tankId={selectedTank} />}

    
      {screenState !== 'game' && (
        <div id="lobby-screen" style={{ display: 'flex' }}>
          {screenState === 'loading' ? (
            <div className="loading-screen">
              <div className="loading-title">Đang khởi chạy trận đấu</div>
              <div className="loading-subtitle">Tải bản đồ, tank và hiệu ứng...</div>
              <div className="loading-bar">
                <div className="loading-fill" style={{ width: `${loadingProgress}%` }} />
              </div>
              <div className="loading-percent">{loadingProgress}%</div>
            </div>
          ) : (
            <>
              <aside className="pick-side pick-side-left">
                {leftPlayers.map((player) => (
                  <div key={player} className="player-slot ally">
                    <div className="slot-content">
                      <span className="player-rank">Đội</span>
                      <span className="player-name">{player}</span>
                    </div>
                  </div>
                ))}
              </aside>

              <main className="pick-main">
                <div className="pick-top">
                  <div className="pick-countdown">BangBang2</div>
                  <div className="mode-pills">
                    <button id="btn-story" className={mode === 'story' ? 'mode-btn active' : 'mode-btn'} onClick={() => setMode('story')}>Cốt truyện</button>
                    <button id="btn-practice" className={mode === 'practice' ? 'mode-btn active' : 'mode-btn'} onClick={() => setMode('practice')}>Tập luyện</button>
                    <button id="btn-survival" className={mode === 'survival' ? 'mode-btn active' : 'mode-btn'} onClick={() => setMode('survival')}>Sinh tồn</button>
                    <button id="btn-moba" className={mode === 'moba' ? 'mode-btn active' : 'mode-btn'} onClick={() => setMode('moba')}>MOBA</button>
                  </div>
                  <input id="player-name-input" type="text" placeholder="Nhập tên người chơi" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
                </div>

                <div className="tank-selection-grid">
                  {tanks.map((tank) => (
                    <button
                      key={tank.id}
                      id={`card-${tank.id}`}
                      type="button"
                      className={selectedTank === tank.id ? 'tank-card selected' : 'tank-card'}
                      onClick={() => selectTank(tank.id)}
                    >
                      <span className="tank-cost">{tank.cost}</span>
                      <div className="tank-icon">
                        <img src={`/${tank.img}`} alt={tank.name} />
                      </div>
                      <div className="tank-name">{tank.name}</div>
                      <div className="tank-desc">{tank.role}</div>
                    </button>
                  ))}
                </div>

                <div className="pick-footer">
                  <div className="selected-panel">
                    <div className="selected-title">Đang chọn</div>
                    <div className="selected-tank">{selectedTankData?.name}</div>
                    <div className="selected-role">{selectedTankData?.role}</div>
                  </div>
                  <button id="start-btn" onClick={() => startGame()} disabled={playerName.length === 0}>Khóa</button>
                </div>
              </main>

              <aside className="pick-side pick-side-right">
                {rightPlayers.map((player) => (
                  <div key={player} className="player-slot enemy">
                    <div className="slot-content">
                      <span className="player-name">{player}</span>
                    </div>
                  </div>
                ))}
                <div className="player-slot my-preview">
                  <div className="slot-content">
                    <span className="my-label">Tân tăng</span>
                    <span className="my-tank">{selectedTankData?.name}</span>
                  </div>
                </div>
              </aside>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
