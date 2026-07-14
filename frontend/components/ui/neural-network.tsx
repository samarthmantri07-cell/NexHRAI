"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface NeuralNetworkProps {
  isActive?: boolean;
  width?: number;
  height?: number;
  nodeCount?: number;
  className?: string;
}

interface Node {
  x: number;
  y: number;
  layer: number;
}

export function NeuralNetwork({
  isActive = true,
  width = 280,
  height = 140,
  nodeCount = 3,
  className = "",
}: NeuralNetworkProps) {
  // 3-layer network: input (4), hidden1 (5), hidden2 (4), output (2)
  const layers = [
    [0.15, 0.35, 0.65, 0.85],
    [0.08, 0.28, 0.48, 0.68, 0.88],
    [0.15, 0.38, 0.62, 0.85],
    [0.30, 0.70],
  ];

  const nodes: Node[] = [];
  const layerXPositions = [0.10, 0.37, 0.63, 0.90];

  layers.forEach((layerNodes, li) => {
    layerNodes.forEach((yRatio) => {
      nodes.push({ x: layerXPositions[li] * width, y: yRatio * height, layer: li });
    });
  });

  // Connections between adjacent layers
  const connections: Array<{ x1: number; y1: number; x2: number; y2: number; delay: number }> = [];
  let delayIdx = 0;
  for (let li = 0; li < layers.length - 1; li++) {
    const fromLayer = nodes.filter((n) => n.layer === li);
    const toLayer = nodes.filter((n) => n.layer === li + 1);
    fromLayer.forEach((from) => {
      toLayer.forEach((to) => {
        connections.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, delay: delayIdx * 0.02 });
        delayIdx++;
      });
    });
  }

  return (
    <div className={className} style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="nn-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.70 0.22 265)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.68 0.22 300)" stopOpacity="0.2" />
          </linearGradient>
          <filter id="nn-node-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {connections.map((conn, i) => (
          <motion.line
            key={i}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="url(#nn-line-grad)"
            strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={isActive ? {
              opacity: [0, 0.6, 0.2, 0.6],
            } : { opacity: 0.2 }}
            transition={{
              duration: 2.5,
              delay: conn.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isOutputLayer = node.layer === layers.length - 1;
          const isInputLayer = node.layer === 0;
          const nodeColor = isOutputLayer
            ? "oklch(0.68 0.22 25)"
            : isInputLayer
            ? "oklch(0.72 0.20 200)"
            : "oklch(0.70 0.22 265)";

          return (
            <motion.circle
              key={i}
              cx={node.x}
              cy={node.y}
              r={isOutputLayer ? 5 : isInputLayer ? 4 : 3.5}
              fill={nodeColor}
              filter="url(#nn-node-glow)"
              initial={{ opacity: 0, scale: 0 }}
              animate={isActive ? {
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.1, 0.8],
              } : { opacity: 0.4, scale: 1 }}
              transition={{
                duration: 1.8 + Math.random(),
                delay: i * 0.05,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Traveling pulse dots */}
        {isActive &&
          connections.slice(0, 8).map((conn, i) => (
            <motion.circle
              key={`pulse-${i}`}
              r={2}
              fill="oklch(0.70 0.22 265)"
              opacity={0.9}
              initial={{ x: conn.x1, y: conn.y1, opacity: 0 }}
              animate={{
                x: [conn.x1, conn.x2],
                y: [conn.y1, conn.y2],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.3 + 0.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
          ))}
      </svg>
    </div>
  );
}
