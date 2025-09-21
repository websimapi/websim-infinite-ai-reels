import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { ReelComposition } from "./Reel.jsx";
const fetchTrendingProjects = async () => {
  try {
    const response = await fetch("/api/v1/projects/trending");
    if (!response.ok) {
      throw new Error(`Failed to fetch trending projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data.sites.data;
  } catch (error) {
    console.error("API Error fetching trending projects:", error);
    const project = await websim.getCurrentProject();
    const creator = await websim.getCreator();
    if (project && creator) {
      return [{ ...project, user: creator }];
    }
    return [];
  }
};
const App = () => {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [usedProjects, setUsedProjects] = useState(/* @__PURE__ */ new Set());
  const observer = useRef();
  useEffect(() => {
    const loadTrending = async () => {
      setIsLoading(true);
      try {
        const projects = await fetchTrendingProjects();
        setTrendingProjects(projects);
        if (projects.length > 0) {
          addNewReel(projects, /* @__PURE__ */ new Set());
        } else {
          setError("No projects found to generate reels.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrending();
  }, []);
  const generateReelConcept = async (project) => {
    const completion = await websim.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that creates concepts for short, engaging, viral "reels" (like TikTok/Instagram Reels) based on a Websim project.
The reel should act as a short, exciting preview or ad for the project, encouraging viewers to check it out.
Respond directly with JSON, following this JSON schema, and no other text.
The reel should be fast-paced and visually interesting. Use short sentences. Ensure the title is very short and punchy.

JSON Schema:
{
  "title": "string (Max 3 words, catchy and bold)",
  "script": "Array<string> (An array of 2-3 short text strings to display on screen, each max 8 words, highlighting cool features)",
  "callToAction": "string (A short call to action, e.g., 'Check it out!', 'Discover more!')",
  "visualStyle": {
    "backgroundColor": "string (A vibrant hex code for the background)",
    "textColor": "string (A contrasting hex code for the text, e.g., #FFFFFF)",
    "fontFamily": "string (A common, bold font like 'Arial', 'Helvetica', 'Impact')"
  },
  "projectInfo": {
    "title": "${project.title}",
    "creator": "${project.user.username}",
    "imageUrl": "https://images.websim.com/v1/site/${project.id}/600",
    "creatorAvatarUrl": "https://images.websim.com/avatar/${project.user.username}"
  }
}`
        },
        {
          role: "user",
          content: `Project Title: ${project.title}
Project Description: ${project.description}
Creator: @${project.user.username}`
        }
      ],
      json: true
    });
    try {
      const result = JSON.parse(completion.content);
      return { ...result, key: project.id + Math.random() };
    } catch (e) {
      console.error("Failed to parse AI response:", completion.content);
      throw new Error("Failed to get a valid concept from AI.");
    }
  };
  const addNewReel = useCallback(async (projects, currentUsed) => {
    if (isLoading || projects.length === 0) return;
    let availableProjects = projects.filter((p) => !currentUsed.has(p.id));
    if (availableProjects.length === 0) {
      availableProjects = projects;
      currentUsed = /* @__PURE__ */ new Set();
    }
    const randomIndex = Math.floor(Math.random() * availableProjects.length);
    const project = availableProjects[randomIndex];
    setIsLoading(true);
    setError(null);
    try {
      const newReelConcept = await generateReelConcept(project);
      setReels((prevReels) => [...prevReels, newReelConcept]);
      const newUsed = new Set(currentUsed).add(project.id);
      setUsedProjects(newUsed);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  const lastReelElementRef = useCallback((node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && reels.length > 0 && trendingProjects.length > 0) {
        addNewReel(trendingProjects, usedProjects);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, addNewReel, reels.length, trendingProjects, usedProjects]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "header", children: [
      /* @__PURE__ */ jsxDEV("h1", { children: "Infinite AI Reels" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 143,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("p", { children: "AI-generated short videos based on trending Websim projects. Scroll down for more!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 144,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 142,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "reel-container", children: reels.map((reel, index) => {
      const isLastElement = index === reels.length - 1;
      return /* @__PURE__ */ jsxDEV("div", { className: "reel-item", ref: isLastElement ? lastReelElementRef : null, children: /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: ReelComposition,
          durationInFrames: 360,
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
          lineNumber: 151,
          columnNumber: 29
        }
      ) }, reel.key, false, {
        fileName: "<stdin>",
        lineNumber: 150,
        columnNumber: 25
      });
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 146,
      columnNumber: 13
    }),
    isLoading && /* @__PURE__ */ jsxDEV("div", { className: "loader-container", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "spinner" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 170,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("p", { className: "loading-text", children: "Generating next reel..." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 171,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 169,
      columnNumber: 17
    }),
    error && /* @__PURE__ */ jsxDEV("p", { style: { color: "red" }, children: [
      "Error: ",
      error
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 175,
      columnNumber: 23
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 141,
    columnNumber: 9
  });
};
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 181,
  columnNumber: 13
}));
