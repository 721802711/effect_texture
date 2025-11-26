
import { NodeType } from '../../types';
import { SVGResult, ensureHexColor, ensureOpacity } from './svgUtils';

export function processInputNode(
  type: NodeType, 
  params: any, 
  resolution: number, 
  input: SVGResult | null
): SVGResult {
  
  switch (type) {
    case NodeType.COLOR: {
      const color = ensureHexColor(params);
      const opacity = ensureOpacity(params);
      
      if (input) {
        // Tinting existing shape
        return {
            xml: `
              <g>
                ${input.xml}
                <rect x="0" y="0" width="${resolution}" height="${resolution}" fill="${color}" fill-opacity="${opacity}" style="mix-blend-mode: multiply; pointer-events: none;" />
              </g>
            `,
            defs: input.defs
        };
      } else {
        // Just a solid color block
        return {
            xml: `<rect x="0" y="0" width="${resolution}" height="${resolution}" fill="${color}" fill-opacity="${opacity}" />`,
            defs: []
        };
      }
    }
    case NodeType.VALUE: {
      // Grayscale block
      const v = Math.floor((params.value ?? 0.5) * 255);
      const hex = `rgb(${v},${v},${v})`;
      return {
          xml: `<rect x="0" y="0" width="${resolution}" height="${resolution}" fill="${hex}" />`,
          defs: []
      };
    }
    case NodeType.ALPHA: {
      const alpha = params.value ?? 1;
      
      if (input) {
        // Wrap the input in a group and apply opacity
        return {
            xml: `<g opacity="${alpha}">${input.xml}</g>`,
            defs: input.defs
        };
      }
      
      // Fallback: White block with varying opacity
      return {
          xml: `<rect x="0" y="0" width="${resolution}" height="${resolution}" fill="white" fill-opacity="${alpha}" />`,
          defs: []
      };
    }
  }

  return { xml: '', defs: [] };
}
