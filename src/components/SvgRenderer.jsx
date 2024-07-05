import React from "react";

function SVGRenderer({ svgText }) {
  //   const parseSVG = (svgText) => {
  //     // Create a temporary div to hold the parsed SVG
  //     const tempDiv = document.createElement("div");
  //     tempDiv.innerHTML = svgText;

  //     // Extract the SVG element
  //     const svgElement = tempDiv.querySelector("svg");

  //     // Convert SVG DOM element into React component
  //     if (svgElement) {
  //       const { tagName, attributes, childNodes } = svgElement;
  //       const reactAttrs = Array.from(attributes).reduce(
  //         (acc, { name, value }) => {
  //           acc[name] = value;
  //           return acc;
  //         },
  //         {}
  //       );

  //       const reactChildren = Array.from(childNodes).map((node) => {
  //         if (node.nodeType === 3) {
  //           return node.textContent;
  //         } else {
  //           return parseSVG(node.outerHTML);
  //         }
  //       });

  //       return React.createElement(tagName, reactAttrs, ...reactChildren);
  //     }

  //     return null;
  //   };

  //   const reactSVG = parseSVG(svgText);

  //   return <div>{reactSVG}</div>;
  return <img src={svgText} alt="" />;
}

export default SVGRenderer;
