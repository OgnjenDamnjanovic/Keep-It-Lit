export interface FirewoodComponent {
  combustionFactor: number;
  totalFirewoodContribution: number;
}
export function areSameFirewoodComponents(
  component1: FirewoodComponent,
  component2: FirewoodComponent
) {
  return (
    component1.combustionFactor === component2.combustionFactor &&
    component1.totalFirewoodContribution ===
    component2.totalFirewoodContribution
  );
}
