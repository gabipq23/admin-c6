import { Tooltip } from "antd";

interface OperatorAvailabilityProps {
  operatorName: string;
  operatorData?: {
    availability?: boolean | null;
    encontrado_via_range?: boolean;
  };
}

export default function OperatorAvailability({
  operatorName,
  operatorData,
}: OperatorAvailabilityProps) {
  if (
    operatorData?.availability === null ||
    operatorData?.availability === undefined
  ) {
    return <div className="flex items-center justify-center ">-</div>;
  }

  if (operatorData?.availability) {
    if (operatorData?.encontrado_via_range) {
      return (
        <div className="flex items-center justify-center ">
          <Tooltip
            title={`${operatorName} - Disponível (via range numérico)`}
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
          </Tooltip>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center ">
          <Tooltip
            title={`${operatorName} - Disponível`}
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </Tooltip>
        </div>
      );
    }
  }

  return (
    <div className="flex items-center justify-center ">
      <Tooltip
        title={`${operatorName} - Indisponível`}
        placement="top"
        styles={{ body: { fontSize: "12px" } }}
      >
        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
      </Tooltip>
    </div>
  );
}
