import { execSync } from "node:child_process";

const port = process.argv[2] || "4000";

function freePortWindows(targetPort) {
  try {
    const output = execSync(`netstat -ano | findstr :${targetPort} | findstr LISTENING`, { encoding: "utf8" });
    const pids = [...new Set(
      output
        .split(/\r?\n/)
        .map((line) => line.trim().split(/\s+/).at(-1))
        .filter((pid) => pid && pid !== "0")
    )];

    for (const pid of pids) {
      execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
      console.log(`Freed port ${targetPort} (stopped PID ${pid})`);
    }
  } catch {
    // Nothing listening on this port.
  }
}

function freePortUnix(targetPort) {
  try {
    execSync(`lsof -ti :${targetPort} | xargs kill -9`, { stdio: "ignore", shell: true });
    console.log(`Freed port ${targetPort}`);
  } catch {
    // Nothing listening on this port.
  }
}

if (process.platform === "win32") {
  freePortWindows(port);
} else {
  freePortUnix(port);
}
