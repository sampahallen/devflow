import { AppProviders } from "./providers/AppProviders.jsx";
import { DevFlowApp } from "./DevFlowApp.jsx";

export function App() {
  return (
    <AppProviders>
      <DevFlowApp />
    </AppProviders>
  );
}
