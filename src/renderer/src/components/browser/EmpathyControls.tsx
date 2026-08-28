import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  FormSelect,
  FormSelectOption,
  Button,
} from "@patternfly/react-core";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";
import DesktopIcon from "@patternfly/react-icons/dist/esm/icons/desktop-icon";

interface EmpathyControlsProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  screenReaderOn: boolean;
  onScreenReaderToggle: (on: boolean) => void;
}

const filters = [
  { value: "none", label: "Normal Vision" },
  { value: "protanopia", label: "Protanopia (Red-blind)" },
  { value: "deuteranopia", label: "Deuteranopia (Green-blind)" },
  { value: "tritanopia", label: "Tritanopia (Blue-blind)" },
  { value: "achromatopsia", label: "Achromatopsia (No color)" },
  { value: "low-vision", label: "Low Vision" },
];

export function EmpathyControls({
  filter,
  onFilterChange,
  screenReaderOn,
  onScreenReaderToggle,
}: EmpathyControlsProps) {
  return (
    <Toolbar
      style={{
        padding: "8px",
        borderBottom: "1px solid var(--pf-t--global--border--color--default)",
      }}
    >
      <ToolbarContent>
        <ToolbarItem>
          <EyeIcon style={{ marginRight: "var(--pf-t--global--spacer--sm)" }} />
          <FormSelect
            value={filter}
            onChange={(_e, value) => onFilterChange(value)}
            aria-label="Vision simulation filter"
            style={{ width: "auto" }}
          >
            {filters.map((f) => (
              <FormSelectOption key={f.value} value={f.value} label={f.label} />
            ))}
          </FormSelect>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            variant={screenReaderOn ? "primary" : "secondary"}
            icon={<DesktopIcon />}
            onClick={() => onScreenReaderToggle(!screenReaderOn)}
          >
            Screen Reader {screenReaderOn ? "On" : "Off"}
          </Button>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
}
