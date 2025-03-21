import Terminal from './components/Terminal';
import Documentation from './components/Documentation';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-4">
        <Terminal />
        <div className="mt-8">
          <Documentation />
        </div>
      </div>
    </div>
  );
}

export default App;