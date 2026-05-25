export interface NetworkOpportunity {
  region: string;
  custRate: string;
  pcRate: string;
  comment: string;
}

export interface NetworkOpportunitiesProps {
  networkOpportunities: NetworkOpportunity[];
}
const NetworkOpportunities = ({
  networkOpportunities,
}: NetworkOpportunitiesProps) => (
  <div className="rounded-lg bg-card border border-border p-6">
    <h3 className="text-lg font-semibold text-foreground mb-4">
      Network / Warehouse Opportunities
    </h3>
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted-foreground text-left">
          <th className="pb-3 pr-4 font-medium">State / Region</th>
          <th className="pb-3 pr-4 font-medium">Customer ₹/Qty</th>
          <th className="pb-3 pr-4 font-medium">Proconnect ₹/Qty</th>
          <th className="pb-3 font-medium">Comment</th>
        </tr>
      </thead>
      <tbody>
        {networkOpportunities?.map((opp, i) => (
          <tr key={i} className="border-t border-border">
            <td className="py-3 pr-4 font-semibold text-foreground">
              {opp.region}
            </td>
            <td className="py-3 pr-4 text-foreground">{opp.custRate}</td>
            <td className="py-3 pr-4 text-primary font-medium">{opp.pcRate}</td>
            <td className="py-3 text-muted-foreground">{opp.comment}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default NetworkOpportunities;
