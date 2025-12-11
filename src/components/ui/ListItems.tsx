import { memo } from "react";

interface ListItemsProps {
  items: readonly string[];
}

export const ListItems = memo<ListItemsProps>(({ items }) => (
  <ul className="list-disc pl-5 space-y-1">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
));

ListItems.displayName = "ListItems";
