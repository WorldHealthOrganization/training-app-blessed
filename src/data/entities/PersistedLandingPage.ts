import _ from "lodash";
import { LandingNode } from "../../domain/entities/LandingPage";

export type PersistedLandingPage = Omit<LandingNode, "children">;
