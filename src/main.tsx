import { createRoot } from "react-dom/client";
import { registerLicense } from "@syncfusion/ej2-base";
import App from "./App.tsx";
import "./index.css";

// Register Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF5cXGpCf0x0WmFZfVhgdVRMZVhbR3VPIiBoS35Rc0RhW3lcc3FRRWNbUkB2VEFf');

createRoot(document.getElementById("root")!).render(<App />);
