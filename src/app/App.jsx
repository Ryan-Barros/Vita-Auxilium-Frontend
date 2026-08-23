import AppRoutes from "./AppRoutes";
import Toast from "../components/Toast";
import { useToastStore } from "../stores/toastStore";

export default function App() {
  const { toast, clearToast } = useToastStore();

  return (
    <>
      <AppRoutes />
      {toast && <Toast {...toast} onClose={clearToast} />}
    </>
  )
}
