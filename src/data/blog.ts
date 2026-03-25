import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 'fingerprint-gemini-tutor',
    title: 'Fingerprint: Building a Planner-Driven Gemini Tutor for Kids',
    excerpt: 'A deep dive into building a voice-first AI learning companion for kids using Gemini Live, FastAPI, and React — with a planner agent, tool executor, and transparent Agent Brain UI.',
    content: `When I started working on Fingerprint, I had a very simple picture in mind: a child talking to an AI that behaves less like a chatbot in a text box and more like a thoughtful teacher sitting across the table. That teacher should listen, notice confusion, decide when to show a picture or ask a question, and remember what worked last time.

This post walks through how I built Fingerprint, a voice-first AI learning companion for kids using Gemini Live, FastAPI, and a React frontend. I will focus on the architecture and the engineering lessons, not just the marketing story.

## Why I built Fingerprint

Most AI tutoring experiences today are thin skins over a chat model. You type a question, the model replies in a long paragraph, and the UI scrolls. That can be useful for adults, but it is not a great fit for a 9-year-old trying to understand fractions.

A real teacher does a few things that a plain chat model does not:
- Watches how the student responds, not just what they ask.
- Chooses from a toolkit: explanation, quick quiz, visual diagram, worked example, story, or a break.
- Adjusts style: some kids want stories, others want analogies or pictures.
- Remembers previous sessions.

I wanted an AI tutor that behaves in that way. Gemini Live gives a good base for natural voice conversation, but by itself it does not track plans, state, or UI. So I put a planner and a tool executor around it and built a frontend that can show whatever the planner decides: quizzes, visuals, worked examples, or search results.

## High level architecture

Here is the logical flow from a learner's browser to Gemini and back:

1. The learner opens the React app, picks or creates a profile, and hits start.
2. The browser opens a WebSocket connection to the backend and streams microphone audio.
3. The backend forwards audio to Gemini Live and receives streaming audio and text back.
4. A SessionState object keeps track of the entire session: topic, mastery, style, last plan, visual context, and more.
5. A planner function uses Gemini (in JSON mode) to decide the next AgentPlan with goal, focus, next_action, learner_state, rescue, and reason.
6. If the plan calls for a tool, an action executor runs it: generate a quiz, create an illustration, search, or generate a worked example.
7. The backend sends JSON events to the frontend. The frontend renders the right card: quiz, image, search facts, worked example, or analysis.
8. The backend inserts short system hints into Gemini Live so the voice output stays aligned with the UI.
9. At the end of the session, a profile store saves a summary for that learner.

Everything is driven by state and events rather than hidden in one long prompt.

## Things I learned while building this

1. A small planner around a strong model can make the system feel much more intentional.
2. Keeping speech, captions, and visuals in sync matters more than perfect text generation in a tutoring context.
3. Explicit state machines are worth the effort.
4. Transparency builds trust — the Agent Brain panel changes how the experience feels.

Read the full article on Medium: https://medium.com/@niroulasudip4/fingerprint-building-a-planner-driven-gemini-tutor-for-kids-031caa177cb4`,
    date: '2026-03-16',
    readTime: '9 min read',
    tags: ['Gemini', 'AI Agent', 'FastAPI', 'React', 'Education'],
  },
];

