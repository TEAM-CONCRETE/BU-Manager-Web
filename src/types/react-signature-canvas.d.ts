declare module "react-signature-canvas" {
  import type { Component } from "react";

  export interface SignatureCanvasProps {
    penColor?: string;
    backgroundColor?: string;
    velocityFilterWeight?: number;
    minWidth?: number;
    maxWidth?: number;
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    onEnd?: () => void;
    onBegin?: () => void;
  }

  export interface SignatureCanvasRef {
    clear: () => void;
    isEmpty: () => boolean;
    fromDataURL: (
      dataURL: string,
      options?: { ratio?: number; width?: number; height?: number },
    ) => void;
    toDataURL: (type?: string, encoderOptions?: number) => string;
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    getCanvas(): HTMLCanvasElement;
    clear(): void;
    isEmpty(): boolean;
    fromDataURL(
      dataURL: string,
      options?: { ratio?: number; width?: number; height?: number },
    ): void;
    toDataURL(type?: string, encoderOptions?: number): string;
  }
}
