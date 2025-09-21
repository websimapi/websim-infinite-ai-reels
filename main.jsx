import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { ReelComposition } from "./Reel.jsx";
const App = () => {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef();
  const generateReelConcept = async (seed) => {
    const project = await websim.getCurrentProject();
    if (!project) {
      throw new Error("Could not fetch project information.");
    }
    const completion = await websim.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that creates concepts for short, engaging, viral "reels" (like TikTok/Instagram Reels) based on a software project's metadata.
Respond directly with JSON, following this JSON schema, and no other text.
The reel should be fast-paced and visually interesting. Use short sentences.
The seed value should be used to create variations. A different seed should result in a different concept.

JSON Schema:
{
  "title": "string (Max 5 words, catchy and bold)",
  "script": "Array<string> (An array of 2-4 short text strings to display on screen, each max 10 words)",
  "visualStyle": {
    "backgroundColor": "string (A vibrant hex code for the background)",
    "textColor": "string (A contrasting hex code for the text, e.g., #FFFFFF)",
    "fontFamily": "string (A common, bold font like 'Arial', 'Helvetica', 'Impact')"
  },
  "music": "string (Describe the mood of the background music, e.g., 'Uplifting electronic', 'Lo-fi hip hop', 'Epic orchestral')"
}`
        },
        {
          role: "user",
          content: `Project Title: ${project.title}
Project Description: ${project.description}
Seed: ${seed}`
        }
      ],
      json: true
    });
    try {
      const result = JSON.parse(completion.content);
      return { ...result, key: Date.now() + Math.random() };
    } catch (e) {
      console.error("Failed to parse AI response:", completion.content);
      throw new Error("Failed to get a valid concept from AI.");
    }
  };
  const addNewReel = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const newReelConcept = await generateReelConcept(Math.random());
      setReels((prevReels) => [...prevReels, newReelConcept]);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  useEffect(() => {
    addNewReel();
  }, []);
  const lastReelElementRef = useCallback((node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && reels.length > 0) {
        addNewReel();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, addNewReel, reels.length]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "header", children: [
      /* @__PURE__ */ jsxDEV("h1", { children: "Infinite AI Reels" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 89,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("p", { children: "AI-generated short videos based on this Websim project. Scroll down for more!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 90,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 88,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "reel-container", children: reels.map((reel, index) => {
      const isLastElement = index === reels.length - 1;
      return /* @__PURE__ */ jsxDEV("div", { className: "reel-item", ref: isLastElement ? lastReelElementRef : null, children: /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: ReelComposition,
          durationInFrames: 300,
          fps: 30,
          compositionWidth: 1080,
          compositionHeight: 1920,
          loop: true,
          controls: true,
          autoplay: true,
          inputProps: reel,
          style: { maxWidth: "100%", maxHeight: "100%" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 97,
          columnNumber: 29
        }
      ) }, reel.key, false, {
        fileName: "<stdin>",
        lineNumber: 96,
        columnNumber: 25
      });
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 92,
      columnNumber: 13
    }),
    isLoading && /* @__PURE__ */ jsxDEV("div", { className: "loader-container", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "spinner" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 116,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("p", { className: "loading-text", children: "Generating next reel..." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 117,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 115,
      columnNumber: 17
    }),
    error && /* @__PURE__ */ jsxDEV("p", { style: { color: "red" }, children: [
      "Error: ",
      error
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 121,
      columnNumber: 23
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 87,
    columnNumber: 9
  });
};
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 127,
  columnNumber: 13
}));
