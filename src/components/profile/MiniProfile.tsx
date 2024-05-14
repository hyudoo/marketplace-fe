import { IProfileInfo } from "@/_types_";
import { Avatar, Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

interface IProfile {
  profile: IProfileInfo;
  canAdd: boolean;
}

const MiniProfile: React.FC<IProfile> = ({ profile, canAdd }) => {
  const router = useRouter();

  return (
    <Card>
      <CardBody>
        <div className="grid grid-cols-4 p-3">
          <Avatar
            className="w-36 h-36 md:w-48 md:h-48"
            isBordered
            alt={profile?.name}
            src={profile?.avatar}
          />
          <div className="items-center flex col-span-3">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold flex gap-x-2">
                {profile?.name}
                {canAdd && (
                  <Tooltip
                    color="primary"
                    content={"Create new Exchange"}
                    className="capitalize">
                    <svg
                      onClick={() =>
                        router.push(`/exchange/${profile?.address}`)
                      }
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-9 h-9">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </Tooltip>
                )}
              </h2>
              <p className="text-xl">{profile?.bio}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default MiniProfile;
