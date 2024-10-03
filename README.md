# <h1>SwipeJump Game</h1>

<p>This is a simple React-based game where the player taps the screen or uses arrow keys to move a ball (the player) left and right. The objective is to jump onto ascending platforms and earn points for each successful jump. The game ends when the player misses a platform, and a "Game Over" popup appears. The game also features sound effects for jumps, landings, and game-over events.</p>

## <h2>Features</h2>

<ul>
  <li>Move the player using arrow keys or by clicking to jump.</li>
  <li>Sound effects for jumping, landing, and game over.</li>
  <li>Randomly generated steps for the player to jump on.</li>
  <li>Score tracking and a high score display after game over.</li>
  <li>Game over popup with a reset button.</li>
</ul>

## <h2>Getting Started</h2>

<p>Follow these steps to run the game locally:</p>

### <h3>Prerequisites</h3>
<ul>
  <li>Node.js installed on your system</li>
  <li>React (This project was built using Create-React-App)</li>
</ul>

### <h3>Installation</h3>
<ol>
  <li>Clone the repository:</li>
  <pre><code>git clone &lt;your-repo-url&gt;</code></pre>
  
  <li>Navigate into the project directory:</li>
  <pre><code>cd swipejump</code></pre>

  <li>Install the dependencies:</li>
  <pre><code>npm install</code></pre>
</ol>

### <h3>Running the Game</h3>
<p>Start the development server by running:</p>
<pre><code>npm start</code></pre>
<p>This will launch the game in your default browser at <a href="http://localhost:3000">http://localhost:3000</a>.</p>

## <h2>How to Play</h2>

<ul>
  <li>Press the left (<code>&larr;</code>) or right (<code>&rarr;</code>) arrow keys to move left and right.</li>
  <li>Click anywhere on the screen to make the player jump.</li>
  <li>Jump onto the green platforms to score points.</li>
  <li>The game ends if you miss a platform.</li>
  <li>Click "Try again?" in the Game Over popup to reset the game and start over.</li>
</ul>

## <h2>Project Structure</h2>
<pre>
.
├── public
│   ├── sounds
│   │   ├── jump.wav
│   │   ├── land.wav
│   │   └── game-over.wav
│   └── index.html
├── src
│   ├── App.js
│   ├── GameOverPopup.js
│   ├── Styles.css
│   └── index.js
└── package.json
</pre>

## <h2>Audio Assets</h2>

<p>Ensure the audio files <code>jump.wav</code>, <code>land.wav</code>, and <code>game-over.wav</code> are placed inside the <code>public/sounds</code> folder. You can obtain free sound effects from websites like <a href="https://freesound.org">Freesound.org</a>.</p>

## <h2>Contributing</h2>

<p>Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.</p>

## <h2>License</h2>

<p>This project is licensed under the MIT License - see the <code>LICENSE</code> file for details.</p>
