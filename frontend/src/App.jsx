import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Avatar from './components/Avatar';

export default function App() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [processedImage, setProcessedImage] = useState(null);
  const [hairStyle, setHairStyle] = useState('short');
  const [beardStyle, setBeardStyle] = useState('none');
  const [animation, setAnimation] = useState('idle');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setProcessedImage(`data:image/png;base64,${data.result}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 p-4 bg-gray-100 space-y-4 overflow-y-auto">
        <h2 className="text-xl font-bold">Avatar Oluştur</h2>
        <label className="block">
          Boy (cm):
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-2 rounded border mt-1" />
        </label>
        <label className="block">
          Kilo (kg):
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-2 rounded border mt-1" />
        </label>
        <label className="block">
          Kıyafet Resmi Yükle:
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 mt-1" />
        </label>
        <label className="block">
          Saç Stili:
          <select value={hairStyle} onChange={(e) => setHairStyle(e.target.value)} className="w-full p-2 rounded border mt-1">
            <option value="short">Kısa</option>
            <option value="long">Uzun</option>
            <option value="curly">Kıvırcık</option>
            <option value="bald">Kel</option>
          </select>
        </label>
        <label className="block">
          Sakal Stili:
          <select value={beardStyle} onChange={(e) => setBeardStyle(e.target.value)} className="w-full p-2 rounded border mt-1">
            <option value="none">Yok</option>
            <option value="mustache">Bıyık</option>
            <option value="goatee">Keçi Sakalı</option>
            <option value="full">Tam Sakal</option>
          </select>
        </label>
        <div className="flex space-x-2">
          <button onClick={() => setAnimation('idle')} className="px-4 py-2 bg-blue-500 text-white rounded">Idle</button>
          <button onClick={() => setAnimation('spin')} className="px-4 py-2 bg-green-500 text-white rounded">Spin</button>
        </div>
        {processedImage && <img src={processedImage} alt="Processed" className="w-full mt-4 rounded shadow" />}
      </div>
      <div className="w-full md:w-2/3 h-full">
        <Canvas camera={{ position: [0, 1.5, 3] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 5]} />
          <OrbitControls />
          <Avatar
            height={height}
            weight={weight}
            image={processedImage}
            hair={hairStyle}
            beard={beardStyle}
            animation={animation}
          />
        </Canvas>
      </div>
    </div>
  );
}