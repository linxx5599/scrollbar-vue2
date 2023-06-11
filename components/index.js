import Scrollbar from "./scrollbar.vue";
import "./index.css";
Scrollbar.install = vue => vue.component(Scrollbar.name, Scrollbar);
export default Scrollbar;