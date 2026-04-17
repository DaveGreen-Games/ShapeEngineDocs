function getBasePath() {
  // GitHub Pages sites are served under /<repo-name>/
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts.length > 0 ? `/${parts[0]}` : "";
}

function getCurrentVersion() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  // parts[0] = repo name, parts[1] = version label
  return parts.length > 1 ? parts[1] : null;
}

async function loadVersions(basePath) {
  const response = await fetch(`${basePath}/versions.json`);
  if (!response.ok) throw new Error(`Failed to load versions.json (${response.status})`);
  return response.json();
}

function createVersionDropdown(versions) {
  const currentVersion = getCurrentVersion();

  const wrapper = document.createElement("div");
  wrapper.className = "version-selector";

  const label = document.createElement("label");
  label.textContent = "Version:";
  label.setAttribute("for", "shapeengine-version-select");

  const select = document.createElement("select");
  select.id = "shapeengine-version-select";

  for (const version of versions) {
    const option = document.createElement("option");
    option.value = version.path;
    option.textContent = version.label + (version.latest ? " (latest)" : "");
    if (version.label === currentVersion) {
      option.selected = true;
    }
    select.appendChild(option);
  }

  select.addEventListener("change", () => {
    window.location.href = select.value;
  });

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  return wrapper;
}

function mountVersionDropdown(versions) {
  // Target the DocFX modern-theme navbar panel
  const target =
    document.querySelector("#navpanel") ||
    document.querySelector("nav .navbar-nav") ||
    document.querySelector(".navbar .container-xxl") ||
    document.querySelector("header nav");

  if (!target) return;

  const dropdown = createVersionDropdown(versions);
  target.appendChild(dropdown);
}

async function initVersionDropdown() {
  try {
    const basePath = getBasePath();
    const versions = await loadVersions(basePath);
    mountVersionDropdown(versions);
  } catch (err) {
    console.warn("Version dropdown unavailable:", err.message);
  }
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initVersionDropdown);
  } else {
    initVersionDropdown();
  }
}

export default {
  iconLinks: [
    {
      icon: "github",
      href: "https://github.com/DaveGreen-Games/ShapeEngine",
      title: "GitHub",
    },
    {
      icon: "twitter",
      href: "https://x.com/ShapeEngine",
      title: "Twitter",
    },
  ],
};
