'use client';

const GameSense = ({ tankId }) => {
    
    

    return (
        <>
  <div id="hud-wrapper">
    <div className="bars-panel">
      <div className="bar-container mp-bar-container">
        <span className="bar-label mp-label">MP</span>
        <div className="bar-bg">
          <div className="bar-fill mp-fill" style={{ width: '60%' }}></div>
          <span className="bar-text">647/1090</span>
        </div>
      </div>
      <div className="bar-container hp-bar-container">
        <span className="bar-label hp-label">HP</span>
        <div className="bar-bg">
          <div className="bar-fill hp-fill" style={{ width: '100%' }}></div>
          <span className="bar-text">3083/3083</span>
        </div>
      </div>
    </div>

    <div className="skills-panel">
      <div className="top-buffs">
        <div className="buff-slot"><img src="/tv.png" alt="" /></div>
        <div className="buff-slot"><img src="/ts.png" alt="" /></div>
        <div className="buff-slot"><img src="/qc.png" alt="" /></div>
        <div className="buff-slot"><img src="/ichi.png" alt="" /><span className="buff-level">LV 2</span></div>
      </div>
      
      <div className="main-skills">
        <div className="skill-slot">
          <img src="/tv.png" alt="Q" />
          <span className="skill-key">Q</span>
          
        </div>
        <div className="skill-slot on-cooldown">
          <img src="/ts.png" alt="W" />
          <div className="cooldown-sweep" style={{ height: '100%' }}></div>
          <span className="cooldown-text">3.3</span>
          <span className="skill-key">R</span>
        </div>
        <div className="skill-slot on-cooldown">
          <img src="/qc.png" alt="E" />
          <div className="cooldown-sweep" style={{ height: '100%' }}></div>
          <span className="cooldown-text">3.5</span>
          <span className="skill-key">E</span>
        </div>
        <div className="skill-slot locked">
          <div className="lock-icon">🔒</div>
          <span className="lock-text">Space</span>
        </div>
        <div className="skill-slot ">
         
          <span className="skill-key">B</span>
        </div>
      </div>

      <div className="exp-container">
        <span className="level-text">2</span>
        <div className="exp-bar-bg">
          <div className="exp-fill" style={{ width: '95%' }}></div>
          <span className="exp-text">191/200</span>
        </div>
      </div>
    </div>
  </div>
  <div id="minimap-container">
    <canvas id="minimap" width={220} height={220} />
  </div>
</>
);
};

export default GameSense;   