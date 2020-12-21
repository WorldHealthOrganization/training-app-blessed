import DashboardModule from "./01-dashboards-module.json";
import DataEntryModule from "./02-data-entry-module.json";
import EventCaptureModule from "./03-event-capture-module.json";
import EventVisualizerModule from "./04-event-visualizer-module.json";
import DataVisualizerModule from "./05-data-visualizer-module.json";
import PivotTablesModule from "./06-pivot-tables-module.json";
import MapsModule from "./07-maps-module.json";
import BulkLoadModule from "./08-bulk-load-module.json";
import TrackerCapture from "./09-tracker-capture-module.json";

export const BuiltinModules = {
    dashboards: DashboardModule,
    "data-entry": DataEntryModule,
    "event-capture": EventCaptureModule,
    "event-visualizer": EventVisualizerModule,
    "data-visualizer": DataVisualizerModule,
    "pivot-tables": PivotTablesModule,
    maps: MapsModule,
    "bulk-load": BulkLoadModule,
    "tracker-capture": TrackerCapture,
};
