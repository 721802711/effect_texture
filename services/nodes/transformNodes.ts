
import { NodeType } from '../../types';
import { SVGResult } from './svgUtils';

export function processTransformNode(
  type: NodeType, 
  params: any, 
  resolution: number, 
  input: SVGResult | null
): SVGResult {
  if (!input) return { xml: '', defs: [] };

  // Center pivot
  const cx = resolution / 2;
  const cy = resolution / 2;

  switch (type) {
    case NodeType.TRANSLATE: {
      const x = (params.x ?? 0) * resolution;
      const y = (params.y ?? 0) * resolution;
      return {
          xml: `<g transform="translate(${x}, ${y})">${input.xml}</g>`,
          defs: input.defs
      };
    }

    case NodeType.ROTATE: {
      const angle = params.angle ?? 0;
      return {
          xml: `<g transform="rotate(${angle}, ${cx}, ${cy})">${input.xml}</g>`,
          defs: input.defs
      };
    }

    case NodeType.SCALE: {
      const s = params.scale ?? 1;
      return {
          xml: `<g transform="translate(${cx}, ${cy}) scale(${s}) translate(-${cx}, -${cy})">${input.xml}</g>`,
          defs: input.defs
      };
    }
  }

  return input;
}
