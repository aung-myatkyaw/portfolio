import { HttpAgent, Actor } from '@icp-sdk/core/agent';
import { safeGetCanisterEnv } from '@icp-sdk/core/agent/canister-env';

/** icp-cli injects PUBLIC_CANISTER_ID:backend at deploy time; asset canister exposes it via ic_env cookie. */
export function getBackendCanisterId() {
  const canisterEnv = safeGetCanisterEnv();
  return (
    canisterEnv?.['PUBLIC_CANISTER_ID:backend'] ||
    import.meta.env.VITE_BACKEND_CANISTER_ID ||
    ''
  );
}

const idlFactory = ({ IDL }) => {
  const AskResult = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
  const ChatTurn = IDL.Record({ role: IDL.Text, content: IDL.Text });
  return IDL.Service({
    ask_about_me: IDL.Func([IDL.Text, IDL.Vec(ChatTurn)], [AskResult], []),
  });
};

/** Last 3 user/assistant pairs, matching the canister cap. */
export const HISTORY_MAX_TURNS = 6;
export const HISTORY_CHAR_CAP = 500;

export function historyForRequest(messages) {
  const turns = messages.filter(
    (message) =>
      (message.role === 'user' || message.role === 'assistant') &&
      !message.excludeFromHistory &&
      typeof message.content === 'string' &&
      message.content.trim()
  );
  return turns.slice(-HISTORY_MAX_TURNS).map((message) => ({
    role: message.role,
    content: message.content.trim().slice(0, HISTORY_CHAR_CAP),
  }));
}

let actorCache = null;
let actorCanisterId = null;

const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('.localhost');

export const getActor = async () => {
  const canisterId = getBackendCanisterId();
  if (!canisterId) {
    throw new Error('Backend canister ID not available');
  }
  if (actorCache && actorCanisterId === canisterId) {
    return actorCache;
  }
  const agent = await HttpAgent.create({
    host: isLocal ? 'http://localhost:4943' : 'https://icp-api.io',
    shouldFetchRootKey: isLocal,
  });
  actorCache = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
  actorCanisterId = canisterId;
  return actorCache;
};

export const resetActorCache = () => {
  actorCache = null;
  actorCanisterId = null;
};

export const isAskMeConfigured = () => Boolean(getBackendCanisterId());

export const SUGGESTED_QUESTIONS = [
  'What are his Kubernetes certifications?',
  'Tell me about his AI infrastructure work',
  'Where does he work now?',
];

export const WELCOME_MESSAGE = {
  role: 'assistant',
  excludeFromHistory: true,
  content:
    "Hi! Ask about Aung's experience, skills, or certifications. This chat remembers your recent questions; nothing is stored on-chain.",
};
