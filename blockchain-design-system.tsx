import React from 'react';

const BlockchainDesignSystem = () => {
  const colors = {
    primary: {
      deepSpaceBlack: '#0D0D0D',
      electricPurple: '#7B2CBF',
      neonGreen: '#39FF14'
    },
    accent: {
      gold: '#FFB700',
      cyan: '#00FFFF',
      crimson: '#DC143C'
    },
    supporting: {
      charcoal: '#36454F',
      silver: '#C0C0C0',
      white: '#FFFFFF'
    }
  };

  const ColorSwatch = ({ color, name, hex }) => (
    <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg">
      <div 
        className="w-20 h-20 rounded-lg mb-3 border border-gray-700"
        style={{ backgroundColor: color }}
      ></div>
      <h4 className="text-sm font-medium text-white mb-1">{name}</h4>
      <p className="text-xs text-gray-400 font-mono">{hex}</p>
    </div>
  );

  const FontExample = ({ fontFamily, name, description, example }) => (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-400 mb-3">{description}</p>
      </div>
      <div style={{ fontFamily }} className="space-y-3">
        <div className="text-3xl font-bold" style={{ color: colors.accent.gold }}>
          {example.heading}
        </div>
        <div className="text-lg font-semibold" style={{ color: colors.primary.electricPurple }}>
          {example.subheading}
        </div>
        <div className="text-base text-white">
          {example.body}
        </div>
        <div className="text-sm font-mono" style={{ color: colors.accent.cyan }}>
          {example.code}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.primary.deepSpaceBlack }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ 
            background: `linear-gradient(45deg, ${colors.primary.electricPurple}, ${colors.accent.cyan}, ${colors.primary.neonGreen})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Blockchain Design System
          </h1>
          <p className="text-xl text-gray-300">Hip Hop × Tech × Prediction Models</p>
        </div>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Color Palette</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">Primary Colors</h3>
            <div className="grid grid-cols-3 gap-4">
              <ColorSwatch color={colors.primary.deepSpaceBlack} name="Deep Space Black" hex="#0D0D0D" />
              <ColorSwatch color={colors.primary.electricPurple} name="Electric Purple" hex="#7B2CBF" />
              <ColorSwatch color={colors.primary.neonGreen} name="Neon Green" hex="#39FF14" />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">Accent Colors</h3>
            <div className="grid grid-cols-3 gap-4">
              <ColorSwatch color={colors.accent.gold} name="Gold" hex="#FFB700" />
              <ColorSwatch color={colors.accent.cyan} name="Cyan Blue" hex="#00FFFF" />
              <ColorSwatch color={colors.accent.crimson} name="Deep Crimson" hex="#DC143C" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-300 mb-4">Supporting Colors</h3>
            <div className="grid grid-cols-3 gap-4">
              <ColorSwatch color={colors.supporting.charcoal} name="Charcoal Gray" hex="#36454F" />
              <ColorSwatch color={colors.supporting.silver} name="Silver" hex="#C0C0C0" />
              <ColorSwatch color={colors.supporting.white} name="White" hex="#FFFFFF" />
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Typography</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <FontExample 
              fontFamily="'Orbitron', monospace"
              name="Orbitron"
              description="Futuristic sans-serif perfect for headings and blockchain branding"
              example={{
                heading: "StarSeeds Protocol",
                subheading: "Prediction Engine v2.0",
                body: "Advanced algorithms predict hip hop trends with 94% accuracy",
                code: "const mint = await starMints.predict();"
              }}
            />

            <FontExample 
              fontFamily="'Inter', system-ui, sans-serif"
              name="Inter"
              description="Modern, highly readable sans-serif for UI and body text"
              example={{
                heading: "Market Analysis",
                subheading: "Real-time Culture Metrics",
                body: "Track emerging artists and viral content across all platforms",
                code: "{ artist: 'emerging', trend: 'rising' }"
              }}
            />

            <FontExample 
              fontFamily="'JetBrains Mono', monospace"
              name="JetBrains Mono"
              description="Developer-focused monospace for code, addresses, and technical data"
              example={{
                heading: "0x4A2B...C9D8",
                subheading: "Smart Contract",
                body: "Deploy prediction models directly to the blockchain",
                code: "function predictTrend(uint256 _data) public pure"
              }}
            />

            <FontExample 
              fontFamily="'Poppins', sans-serif"
              name="Poppins"
              description="Geometric sans-serif with personality, great for marketing content"
              example={{
                heading: "Hip Hop Meets DeFi",
                subheading: "Culture-Driven Finance",
                body: "Democratizing access to music industry predictions and investments",
                code: "staticFruit.generateValue(hiphop_data)"
              }}
            />

            <FontExample 
              fontFamily="'Space Grotesk', sans-serif"
              name="Space Grotesk"
              description="Contemporary sans-serif with tech vibes, perfect for modern interfaces"
              example={{
                heading: "StaticFruit Dashboard",
                subheading: "Trend Prediction Hub",
                body: "Monitor cultural shifts and predict the next big breakthrough",
                code: "await analyzeCulturalData(trendVector)"
              }}
            />

            <FontExample 
              fontFamily="'Fira Code', monospace"
              name="Fira Code"
              description="Monospace with coding ligatures for enhanced developer experience"
              example={{
                heading: "API Integration",
                subheading: "Developer Tools",
                body: "Connect your apps to our prediction models via REST API",
                code: "const response = await fetch('/api/predict')"
              }}
            />

          </div>
        </section>

        {/* Python Graph Styling */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-8">Python Graph Integration</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Matplotlib Style Example */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Matplotlib Configuration</h3>
              <div className="bg-black p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div style={{ color: colors.accent.cyan }}>import matplotlib.pyplot as plt</div>
                <div style={{ color: colors.accent.cyan }}>import seaborn as sns</div>
                <br />
                <div style={{ color: colors.primary.neonGreen }}># Set dark theme for blockchain aesthetics</div>
                <div style={{ color: colors.supporting.white }}>plt.style.use(<span style={{ color: colors.accent.gold }}>'dark_background'</span>)</div>
                <br />
                <div style={{ color: colors.primary.neonGreen }}># Custom color palette</div>
                <div style={{ color: colors.supporting.white }}>colors = [<span style={{ color: colors.accent.gold }}>'#7B2CBF'</span>, <span style={{ color: colors.accent.gold }}>'#39FF14'</span>, <span style={{ color: colors.accent.gold }}>'#FFB700'</span>,</div>
                <div style={{ color: colors.supporting.white }}>          <span style={{ color: colors.accent.gold }}>'#00FFFF'</span>, <span style={{ color: colors.accent.gold }}>'#DC143C'</span>, <span style={{ color: colors.accent.gold }}>'#C0C0C0'</span>]</div>
              </div>
            </div>

            {/* Plotly Style Example */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Plotly Template</h3>
              <div className="bg-black p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div style={{ color: colors.accent.cyan }}>import plotly.graph_objects as go</div>
                <div style={{ color: colors.accent.cyan }}>import plotly.express as px</div>
                <br />
                <div style={{ color: colors.primary.neonGreen }}># Custom template</div>
                <div style={{ color: colors.supporting.white }}>template = <span style={{ color: colors.accent.gold }}>'plotly_dark'</span></div>
                <br />
                <div style={{ color: colors.primary.neonGreen }}># Color sequence for StarSeeds</div>
                <div style={{ color: colors.supporting.white }}>color_sequence = [<span style={{ color: colors.accent.gold }}>'#7B2CBF'</span>, <span style={{ color: colors.accent.gold }}>'#39FF14'</span>,</div>
                <div style={{ color: colors.supporting.white }}>                   <span style={{ color: colors.accent.gold }}>'#FFB700'</span>, <span style={{ color: colors.accent.gold }}>'#00FFFF'</span>]</div>
              </div>
            </div>

          </div>

          {/* Graph Types & Styling */}
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6">Recommended Graph Styles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-black p-4 rounded-lg border border-gray-700">
                <h4 className="font-semibold mb-3" style={{ color: colors.primary.electricPurple }}>
                  Trend Predictions
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Line charts with gradient fills</li>
                  <li>• Electric Purple → Neon Green</li>
                  <li>• Animated trend arrows</li>
                  <li>• Confidence intervals in Cyan</li>
                </ul>
              </div>

              <div className="bg-black p-4 rounded-lg border border-gray-700">
                <h4 className="font-semibold mb-3" style={{ color: colors.accent.gold }}>
                  Market Analysis
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Candlestick charts in Gold/Crimson</li>
                  <li>• Volume bars in Neon Green</li>
                  <li>• Moving averages in Silver</li>
                  <li>• Support/resistance in Purple</li>
                </ul>
              </div>

              <div className="bg-black p-4 rounded-lg border border-gray-700">
                <h4 className="font-semibold mb-3" style={{ color: colors.accent.cyan }}>
                  Cultural Metrics
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Heatmaps with Purple-Cyan scale</li>
                  <li>• Network graphs in Neon Green</li>
                  <li>• Bubble charts sized by influence</li>
                  <li>• Radar charts for artist profiles</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Complete Python Styling Code */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Complete Styling Configuration</h3>
            <div className="bg-black p-4 rounded-lg font-mono text-xs overflow-x-auto">
              <div style={{ color: colors.primary.neonGreen }}># StarSeeds Blockchain Graph Styling</div>
              <div style={{ color: colors.accent.cyan }}>import matplotlib.pyplot as plt</div>
              <div style={{ color: colors.accent.cyan }}>import seaborn as sns</div>
              <div style={{ color: colors.accent.cyan }}>from matplotlib import font_manager</div>
              <br />
              <div style={{ color: colors.primary.neonGreen }}># Custom theme configuration</div>
              <div style={{ color: colors.supporting.white }}>STARSEEDS_COLORS = {`{`}</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'primary'</span>: [<span style={{ color: colors.accent.gold }}>'#0D0D0D'</span>, <span style={{ color: colors.accent.gold }}>'#7B2CBF'</span>, <span style={{ color: colors.accent.gold }}>'#39FF14'</span>],</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'accent'</span>: [<span style={{ color: colors.accent.gold }}>'#FFB700'</span>, <span style={{ color: colors.accent.gold }}>'#00FFFF'</span>, <span style={{ color: colors.accent.gold }}>'#DC143C'</span>],</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'supporting'</span>: [<span style={{ color: colors.accent.gold }}>'#36454F'</span>, <span style={{ color: colors.accent.gold }}>'#C0C0C0'</span>, <span style={{ color: colors.accent.gold }}>'#FFFFFF'</span>]</div>
              <div style={{ color: colors.supporting.white }}>{`}`}</div>
              <br />
              <div style={{ color: colors.primary.neonGreen }}># Apply custom styling</div>
              <div style={{ color: colors.supporting.white }}>plt.rcParams.update({`{`}</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'figure.facecolor'</span>: <span style={{ color: colors.accent.gold }}>'#0D0D0D'</span>,</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'axes.facecolor'</span>: <span style={{ color: colors.accent.gold }}>'#0D0D0D'</span>,</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'axes.edgecolor'</span>: <span style={{ color: colors.accent.gold }}>'#36454F'</span>,</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'text.color'</span>: <span style={{ color: colors.accent.gold }}>'#FFFFFF'</span>,</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'axes.labelcolor'</span>: <span style={{ color: colors.accent.gold }}>'#C0C0C0'</span>,</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'xtick.color'</span>: <span style={{ color: colors.accent.gold }}>'#C0C0C0'</span>,</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'ytick.color'</span>: <span style={{ color: colors.accent.gold }}>'#C0C0C0'</span>,</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'grid.color'</span>: <span style={{ color: colors.accent.gold }}>'#36454F'</span>,</div>
              <div style={{ color: colors.supporting.white }}>    <span style={{ color: colors.accent.gold }}>'font.family'</span>: <span style={{ color: colors.accent.gold }}>'Inter'</span></div>
              <div style={{ color: colors.supporting.white }}>{`}`})</div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mt-12 bg-gray-900 p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Usage Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.primary.electricPurple }}>
                Font Pairing Recommendations
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li><strong>Headlines:</strong> Orbitron + Space Grotesk</li>
                <li><strong>UI Text:</strong> Inter + Poppins</li>
                <li><strong>Code/Data:</strong> JetBrains Mono + Fira Code</li>
                <li><strong>Graphs:</strong> Inter for labels, JetBrains for data</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.accent.cyan }}>
                Color Application
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li><strong>Backgrounds:</strong> Deep Space Black + Charcoal</li>
                <li><strong>Primary Actions:</strong> Electric Purple + Neon Green</li>
                <li><strong>Success/Value:</strong> Gold + Neon Green</li>
                <li><strong>Graph Highlights:</strong> Cyan + Purple</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.accent.gold }}>
                Graph Best Practices
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li><strong>Trends:</strong> Purple → Green gradients</li>
                <li><strong>Data Points:</strong> Gold for key metrics</li>
                <li><strong>Predictions:</strong> Cyan with confidence bands</li>
                <li><strong>Alerts:</strong> Crimson for anomalies</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BlockchainDesignSystem;