import { Headshot } from "@/contexts/AppContext/types";
import { Data, Style } from "@/contexts/AssetContext/types";
import { Brand } from "@/contexts/BrandContext/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Position {
  x: number;
  y: number;
}
export interface ComponetProps {
  data: Data;
  brand: Brand;
  style: Style;
  className?: string;
  headshot?: Headshot;
}
