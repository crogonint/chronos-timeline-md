import { ChronosDataItem, Flags } from "../utils/types";
import { TimelineOptionsComparisonFunction } from "vis-timeline";
import { moment } from "vis-timeline/standalone";

export const orderFunctionBuilder: (
  flags: Flags
) => TimelineOptionsComparisonFunction = (flags: Flags) => {
  return (a: ChronosDataItem, b: ChronosDataItem) => {
    // CRITICAL FIX: Sort by type FIRST to maintain stacking hierarchy
    // Type priority: background (Periods) < point < range/box (Events)
    const typeOrder: Record<string, number> = {
      'background': 0,  // Periods go to back
      'point': 1,       // Points in middle
      'range': 2,       // Events in front
      'box': 2          // Single-date events treated same as ranges
    };
    
    const aType = typeOrder[a.type as string] ?? 999;
    const bType = typeOrder[b.type as string] ?? 999;
    
    if (aType !== bType) {
      return aType - bType;  // Lower numbers render first (behind)
    }
    
    // Within same type, use user-specified ordering
    if (!flags.orderBy) return 0;

    for (let ordering of orderByFlagParser(flags.orderBy)) {
      let diff = 0;

      switch (ordering.sortingField) {
        case "start":
          diff = moment(b.start).diff(a.start);
          break;
        case "end":
          diff = moment(b.end).diff(a.end);
          break;
        case "content":
          diff = b.content.localeCompare(a.content);
          break;
        case "style":
        case "color":
          diff = (b.style ?? "")?.localeCompare(a.style ?? "") ?? 0;
          break;
        case "description":
          diff =
            (b.cDescription ?? "")?.localeCompare(a.cDescription ?? "") ?? 0;
          break;
      }

      if (diff !== 0) {
        return ordering.sortingOrder * diff;
      }
    }

    return 0;
  };
};

export const orderByFlagParser: (orderBy: string[]) => SortingOptions[] = (
  orderBy: string[]
) => {
  return orderBy.map((field) => {
    field = field.trim();
    return {
      sortingField: field.startsWith("-") ? field.substring(1) : field,
      sortingOrder: field.startsWith("-")
        ? SortingOrder.DESC
        : SortingOrder.ASC,
    };
  });
};

export enum SortingOrder {
  DESC = -1,
  ASC = 1,
}

export type SortingOptions = {
  sortingField: string;
  sortingOrder: SortingOrder;
};
