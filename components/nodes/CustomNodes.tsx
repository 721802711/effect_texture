
import React, { memo, useEffect, useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../../store';
import { NodeType } from '../../types';
import { SliderControl } from '../ui/Controls';
import { generateTexturePNG } from '../../services/graphCompiler';

// Helper Component for Node Previews
const NodePreview = ({ nodeId, visible }: { nodeId: string, visible?: boolean }) => {
  const { nodes, edges } = useStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
      if (!visible) {
          setPreviewUrl(null);
          return;
      }

      let active = true;
      const generate = async () => {
          // Generate low-res thumbnail (128px) for performance
          try {
             // Pass nodeId to generateTexturePNG to render the graph up to this node
             const url = await generateTexturePNG(nodes, edges, 128, nodeId);
             if (active) setPreviewUrl(url);
          } catch(e) { 
             console.error("Preview generation failed", e); 
          }
      }
      
      // Debounce to prevent heavy rendering during drag
      const timeout = setTimeout(generate, 300); 
      return () => { active = false; clearTimeout(timeout); }
  }, [nodes, edges, nodeId, visible]);

  if (!visible) return null;

  return (
      <div className="w-32 h-32 bg-black/50 rounded mt-3 overflow-hidden border border-white/5 relative group/preview mx-auto">
          {previewUrl ? (
             <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          ) : (
             <div className="w-full h-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
             </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-1 opacity-0 group-hover/preview:opacity-100 transition-opacity text-[9px] text-center text-gray-400">
             128px
          </div>
      </div>
  );
}

// ============================================================================
// 1. GENERATOR NODES
// ============================================================================

const RectangleNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode 
      id={id} 
      label={data.label} 
      selected={selected} 
      inputs={[]} 
      outputs={['out']} 
      headerColor="bg-orange-500/80"
      showPreview={data.params.showPreview}
    >
      <SliderControl label="Width" value={data.params.width ?? 300} min={1} max={512} step={1} onChange={(v:number) => updateParams(id, {width:v})} />
      <SliderControl label="Height" value={data.params.height ?? 300} min={1} max={512} step={1} onChange={(v:number) => updateParams(id, {height:v})} />
      
      <div className="grid grid-cols-2 gap-x-2">
         <SliderControl label="Radius TL" value={data.params.rTL ?? 0} min={0} max={150} step={1} onChange={(v:number) => updateParams(id, {rTL:v})} />
         <SliderControl label="Radius TR" value={data.params.rTR ?? 0} min={0} max={150} step={1} onChange={(v:number) => updateParams(id, {rTR:v})} />
         <SliderControl label="Radius BL" value={data.params.rBL ?? 0} min={0} max={150} step={1} onChange={(v:number) => updateParams(id, {rBL:v})} />
         <SliderControl label="Radius BR" value={data.params.rBR ?? 0} min={0} max={150} step={1} onChange={(v:number) => updateParams(id, {rBR:v})} />
      </div>
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const CircleNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode 
      id={id} 
      label={data.label} 
      selected={selected} 
      inputs={[]} 
      outputs={['out']} 
      headerColor="bg-orange-500/80"
      showPreview={data.params.showPreview}
    >
      <SliderControl label="Width" value={data.params.width ?? 300} min={1} max={512} step={1} onChange={(v:number) => updateParams(id, {width:v})} />
      <SliderControl label="Height" value={data.params.height ?? 300} min={1} max={512} step={1} onChange={(v:number) => updateParams(id, {height:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const PolygonNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode 
      id={id} 
      label={data.label} 
      selected={selected} 
      inputs={[]} 
      outputs={['out']} 
      headerColor="bg-orange-500/80"
      showPreview={data.params.showPreview}
    >
       <SliderControl label="Points" value={data.params.points ?? 5} min={3} max={20} step={1} onChange={(v:number) => updateParams(id, {points:Math.round(v)})} />
       <SliderControl label="Inner Radius" value={data.params.innerRadius ?? 50} min={1} max={250} step={1} onChange={(v:number) => updateParams(id, {innerRadius:v})} />
       <SliderControl label="Outer Radius" value={data.params.outerRadius ?? 100} min={1} max={250} step={1} onChange={(v:number) => updateParams(id, {outerRadius:v})} />
       <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const WavyRingNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode 
      id={id} 
      label={data.label} 
      selected={selected} 
      inputs={[]} 
      outputs={['out']} 
      headerColor="bg-orange-500/80"
      showPreview={data.params.showPreview}
    >
       <SliderControl label="Radius" value={data.params.radius ?? 100} min={10} max={200} step={1} onChange={(v:number) => updateParams(id, {radius:v})} />
       <SliderControl label="Frequency" value={data.params.frequency ?? 20} min={3} max={50} step={1} onChange={(v:number) => updateParams(id, {frequency:Math.round(v)})} />
       <SliderControl label="Amplitude" value={data.params.amplitude ?? 10} min={0} max={40} step={1} onChange={(v:number) => updateParams(id, {amplitude:v})} />
       <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const BeamNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode 
      id={id} 
      label={data.label} 
      selected={selected} 
      inputs={[]} 
      outputs={['out']} 
      headerColor="bg-orange-500/80"
      showPreview={data.params.showPreview}
    >
       <SliderControl label="Length" value={data.params.length ?? 250} min={50} max={400} step={1} onChange={(v:number) => updateParams(id, {length:v})} />
       <SliderControl label="Top Width" value={data.params.topWidth ?? 5} min={0} max={100} step={1} onChange={(v:number) => updateParams(id, {topWidth:v})} />
       <SliderControl label="Bottom Width" value={data.params.bottomWidth ?? 100} min={1} max={200} step={1} onChange={(v:number) => updateParams(id, {bottomWidth:v})} />
       <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

// ============================================================================
// 2. INPUT NODES
// ============================================================================

const ColorNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode 
      id={id} 
      label={data.label} 
      selected={selected} 
      inputs={['in']} 
      outputs={['rgba']} 
      headerColor="bg-emerald-500/80"
      showPreview={false} // Color node already has a custom preview
    >
      <div className="flex gap-2 mb-2">
        <div className="w-full h-8 rounded border border-white/10 shadow-inner relative overflow-hidden">
           <div className="absolute inset-0 checkerboard-bg opacity-20" />
           <div 
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(${data.params.r ?? 255},${data.params.g ?? 255},${data.params.b ?? 255}, 1)` }}
           />
        </div>
      </div>
      <SliderControl label="Red" value={data.params.r ?? 255} min={0} max={255} step={1} onChange={(v:number) => updateParams(id, {r:v})} />
      <SliderControl label="Green" value={data.params.g ?? 255} min={0} max={255} step={1} onChange={(v:number) => updateParams(id, {g:v})} />
      <SliderControl label="Blue" value={data.params.b ?? 255} min={0} max={255} step={1} onChange={(v:number) => updateParams(id, {b:v})} />
    </BaseNode>
  );
};

const ValueNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode 
      id={id} 
      label={data.label} 
      selected={selected} 
      inputs={[]} 
      outputs={['val']} 
      headerColor="bg-gray-500/80"
      showPreview={false}
    >
      <SliderControl 
        label="Luminance" 
        value={data.params.value ?? 0.5} 
        min={0} max={1} 
        onChange={(v:number) => updateParams(id, {value:v})} 
      />
    </BaseNode>
  );
};

const AlphaNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode 
      id={id} 
      label={data.label} 
      selected={selected} 
      inputs={['in']} // Added input
      outputs={['alpha']} 
      headerColor="bg-gray-400/80"
      showPreview={data.params.showPreview}
    >
      <div className="flex gap-2 mb-2">
        <div className="w-full h-8 rounded border border-white/10 shadow-inner relative overflow-hidden">
           <div className="absolute inset-0 checkerboard-bg opacity-20" />
           <div 
              className="absolute inset-0 bg-white transition-opacity"
              style={{ opacity: data.params.value ?? 1 }}
           />
        </div>
      </div>
      <SliderControl 
        label="Opacity" 
        value={data.params.value ?? 1} 
        min={0} max={1} 
        onChange={(v:number) => updateParams(id, {value:v})} 
      />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

// ============================================================================
// 3. MATH NODES (CSG)
// ============================================================================

const MathAddNode = ({ id, data, selected }: any) => (
  <BaseNode id={id} label="Add (Union)" selected={selected} inputs={['a', 'b']} outputs={['out']} headerColor="bg-rose-500/80" showPreview={data.params.showPreview}>
     <div className="flex flex-col gap-4 py-1">
       <div className="flex justify-between items-center text-[10px] text-gray-500 px-1">
         <span>Input A</span>
         <span>Input B</span>
       </div>
       <div className="text-[10px] text-gray-600 text-center italic">A + B (Union)</div>
       <NodePreview nodeId={id} visible={data.params.showPreview === true} />
     </div>
  </BaseNode>
);

const MathSubNode = ({ id, data, selected }: any) => (
  <BaseNode id={id} label="Subtract (Difference)" selected={selected} inputs={['a', 'b']} outputs={['out']} headerColor="bg-rose-500/80" showPreview={data.params.showPreview}>
     <div className="flex flex-col gap-4 py-1">
       <div className="flex justify-between items-center text-[10px] text-gray-500 px-1">
         <span>Input A</span>
         <span>Input B</span>
       </div>
       <div className="text-[10px] text-gray-600 text-center italic">A - B (Difference)</div>
       <NodePreview nodeId={id} visible={data.params.showPreview === true} />
     </div>
  </BaseNode>
);

const MathMultiplyNode = ({ id, data, selected }: any) => (
  <BaseNode id={id} label="Multiply (Intersection)" selected={selected} inputs={['a', 'b']} outputs={['out']} headerColor="bg-rose-500/80" showPreview={data.params.showPreview}>
     <div className="flex flex-col gap-4 py-1">
       <div className="flex justify-between items-center text-[10px] text-gray-500 px-1">
         <span>Input A</span>
         <span>Input B</span>
       </div>
       <div className="text-[10px] text-gray-600 text-center italic">A &times; B (Intersection)</div>
       <NodePreview nodeId={id} visible={data.params.showPreview === true} />
     </div>
  </BaseNode>
);

const MathDivideNode = ({ id, data, selected }: any) => (
  <BaseNode id={id} label="Divide (Exclusion)" selected={selected} inputs={['a', 'b']} outputs={['out']} headerColor="bg-rose-500/80" showPreview={data.params.showPreview}>
     <div className="flex flex-col gap-4 py-1">
       <div className="flex justify-between items-center text-[10px] text-gray-500 px-1">
         <span>Input A</span>
         <span>Input B</span>
       </div>
       <div className="text-[10px] text-gray-600 text-center italic">A &#8853; B (Exclusion)</div>
       <NodePreview nodeId={id} visible={data.params.showPreview === true} />
     </div>
  </BaseNode>
);

// ============================================================================
// 4. FILTER NODES
// ============================================================================

const FillNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode id={id} label="Fill" selected={selected} inputs={['in']} outputs={['out']} headerColor="bg-blue-500/80" showPreview={data.params.showPreview}>
      <div className="flex items-center justify-between mb-2 px-1">
         <label className="text-[10px] text-gray-500 font-medium">Fill Enabled</label>
         <input 
           type="checkbox" 
           className="accent-purple-500 cursor-pointer"
           checked={data.params.fillEnabled ?? true} 
           onChange={(e) => updateParams(id, {fillEnabled: e.target.checked})} 
         />
      </div>
      <SliderControl label="Stroke Width" value={data.params.strokeWidth ?? 0} min={0} max={20} step={0.5} onChange={(v:number) => updateParams(id, {strokeWidth:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const GlowNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode id={id} label="Hard Glow" selected={selected} inputs={['in']} outputs={['out']} headerColor="bg-blue-500/80" showPreview={data.params.showPreview}>
      <SliderControl label="Radius" value={data.params.radius ?? 20} min={1} max={100} step={1} onChange={(v:number) => updateParams(id, {radius:v})} />
      <SliderControl label="Intensity" value={data.params.intensity ?? 1.5} min={0} max={5} onChange={(v:number) => updateParams(id, {intensity:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const NeonNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode id={id} label="Neon" selected={selected} inputs={['in']} outputs={['out']} headerColor="bg-blue-500/80" showPreview={data.params.showPreview}>
      <SliderControl label="Radius" value={data.params.radius ?? 15} min={1} max={100} step={1} onChange={(v:number) => updateParams(id, {radius:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const SoftBlurNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode id={id} label="Soft Blur" selected={selected} inputs={['in']} outputs={['out']} headerColor="bg-blue-500/80" showPreview={data.params.showPreview}>
      <SliderControl label="Radius" value={data.params.radius ?? 5} min={0} max={50} step={1} onChange={(v:number) => updateParams(id, {radius:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const StrokeNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode id={id} label="Stroke" selected={selected} inputs={['in']} outputs={['out']} headerColor="bg-blue-500/80" showPreview={data.params.showPreview}>
      <SliderControl label="Width" value={data.params.width ?? 1} min={0} max={20} step={0.5} onChange={(v:number) => updateParams(id, {width:v})} />
      <SliderControl label="Opacity" value={data.params.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v:number) => updateParams(id, {opacity:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const GradientFadeNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode id={id} label="Gradient Fade" selected={selected} inputs={['in']} outputs={['out']} headerColor="bg-blue-500/80" showPreview={data.params.showPreview}>
      <SliderControl label="Angle" value={data.params.direction ?? 90} min={0} max={360} step={1} onChange={(v:number) => updateParams(id, {direction:v})} />
      <SliderControl label="Start Opacity" value={data.params.start ?? 1} min={0} max={1} onChange={(v:number) => updateParams(id, {start:v})} />
      <SliderControl label="End Opacity" value={data.params.end ?? 0} min={0} max={1} onChange={(v:number) => updateParams(id, {end:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

// ============================================================================
// 5. TRANSFORM NODES
// ============================================================================

const TranslateNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode id={id} label="Translate" selected={selected} inputs={['in']} outputs={['out']} headerColor="bg-violet-500/80" showPreview={data.params.showPreview}>
      <SliderControl label="X Offset" value={data.params.x ?? 0} min={-1} max={1} onChange={(v:number) => updateParams(id, {x:v})} />
      <SliderControl label="Y Offset" value={data.params.y ?? 0} min={-1} max={1} onChange={(v:number) => updateParams(id, {y:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const RotateNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode id={id} label="Rotate" selected={selected} inputs={['in']} outputs={['out']} headerColor="bg-violet-500/80" showPreview={data.params.showPreview}>
      <SliderControl label="Angle" value={data.params.angle ?? 0} min={0} max={360} step={1} onChange={(v:number) => updateParams(id, {angle:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

const ScaleNode = ({ id, data, selected }: any) => {
  const updateParams = useStore(s => s.updateNodeParams);
  return (
    <BaseNode id={id} label="Scale" selected={selected} inputs={['in']} outputs={['out']} headerColor="bg-violet-500/80" showPreview={data.params.showPreview}>
      <SliderControl label="Factor" value={data.params.scale ?? 1} min={0.1} max={5} onChange={(v:number) => updateParams(id, {scale:v})} />
      <NodePreview nodeId={id} visible={data.params.showPreview === true} />
    </BaseNode>
  );
};

// ============================================================================
// 6. OUTPUT NODE
// ============================================================================

const OutputNode = ({ id, data, selected }: any) => {
  const textureUrl = useStore((state) => state.previewTextureUrl);
  
  return (
    <BaseNode id={id} label="OUTPUT" selected={selected} inputs={['in']} headerColor="bg-white" className="w-64" showPreview={false}>
      <div className="flex flex-col gap-2">
         {/* Preview Area */}
         <div className="w-full aspect-square bg-black/50 rounded overflow-hidden border border-white/10 relative">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            />
            {textureUrl ? (
               <img src={textureUrl} alt="Output" className="w-full h-full object-contain relative z-10" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                  Waiting for render...
               </div>
            )}
         </div>

         <div className="text-[10px] text-gray-500 text-center">
            {data.params.resolution || "512"}px Output
         </div>
      </div>
    </BaseNode>
  );
};

export const nodeTypes = {
  custom: RectangleNode, 
  [NodeType.RECTANGLE]: memo(RectangleNode),
  [NodeType.CIRCLE]: memo(CircleNode),
  [NodeType.POLYGON]: memo(PolygonNode),
  [NodeType.WAVY_RING]: memo(WavyRingNode),
  [NodeType.BEAM]: memo(BeamNode),
  
  [NodeType.COLOR]: memo(ColorNode),
  [NodeType.VALUE]: memo(ValueNode),
  [NodeType.ALPHA]: memo(AlphaNode),
  [NodeType.ADD]: memo(MathAddNode),
  [NodeType.SUBTRACT]: memo(MathSubNode),
  [NodeType.MULTIPLY]: memo(MathMultiplyNode),
  [NodeType.DIVIDE]: memo(MathDivideNode),
  
  // New Nodes
  [NodeType.FILL]: memo(FillNode),
  [NodeType.GLOW]: memo(GlowNode),
  [NodeType.NEON]: memo(NeonNode),
  [NodeType.SOFT_BLUR]: memo(SoftBlurNode),
  [NodeType.STROKE]: memo(StrokeNode),
  [NodeType.GRADIENT_FADE]: memo(GradientFadeNode),
  [NodeType.TRANSLATE]: memo(TranslateNode),
  [NodeType.ROTATE]: memo(RotateNode),
  [NodeType.SCALE]: memo(ScaleNode),
  
  [NodeType.OUTPUT]: memo(OutputNode),
  outputNode: memo(OutputNode)
};
