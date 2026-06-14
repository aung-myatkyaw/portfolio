import { HttpAgent, Actor } from '@dfinity/agent';

export const BACKEND_CANISTER_ID = import.meta.env.VITE_BACKEND_CANISTER_ID;

const idlFactory = ({ IDL }) => {
  const AskResult = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
  return IDL.Service({
    ask_about_me: IDL.Func([IDL.Text], [AskResult], []),
  });
};

let actorCache = null;

const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('.localhost');

export const getActor = async () => {
  if (actorCache) return actorCache;
  const agent = await HttpAgent.create({
    host: isLocal ? 'http://localhost:4943' : 'https://icp-api.io',
    shouldFetchRootKey: isLocal,
  });
  actorCache = Actor.createActor(idlFactory, {
    agent,
    canisterId: BACKEND_CANISTER_ID,
  });
  return actorCache;
};

export const resetActorCache = () => {
  actorCache = null;
};

export const isAskMeConfigured = () => Boolean(BACKEND_CANISTER_ID);

export const SUGGESTED_QUESTIONS = [
  'What are his Kubernetes certifications?',
  'Tell me about his AI infrastructure work',
  'Where does he work now?',
];

export const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi! Ask one question at a time about Aung's experience, skills, or certifications. Each answer is independent — no memory between messages.",
};
