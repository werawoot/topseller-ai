import { StyleSheet, Text, View } from "react-native";
import { Canvas, RoundedRect } from "@shopify/react-native-skia";

import type { PromoTemplate } from "../types/app";

type PromoTemplateCanvasProps = {
  template: PromoTemplate;
};

export const PromoTemplateCanvas = ({ template }: PromoTemplateCanvasProps) => {
  return (
    <View style={styles.wrap}>
      <Canvas style={styles.canvas}>
        <RoundedRect x={0} y={0} width={280} height={110} r={26} color="#1F2937" />
        <RoundedRect x={170} y={16} width={92} height={78} r={20} color="#FDBA74" />
      </Canvas>
      <View style={styles.overlay}>
        <View>
          <Text style={styles.title}>{template.title}</Text>
          <Text style={styles.subtitle}>{template.subtitle}</Text>
        </View>
        <View style={styles.discountWrap}>
          <Text style={styles.discount}>{template.discount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: 280,
    height: 110
  },
  canvas: {
    width: 280,
    height: 110
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 4,
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "500"
  },
  discountWrap: {
    width: 92,
    alignItems: "center",
    justifyContent: "center"
  },
  discount: {
    color: "#9A3412",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center"
  }
});
