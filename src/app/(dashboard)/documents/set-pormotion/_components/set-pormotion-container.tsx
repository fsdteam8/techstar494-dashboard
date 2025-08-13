import { SquarePen, Trash2 } from "lucide-react";
import React from "react";

interface PromotionListType {
  id: number;
  title: string;
}

const promotionList: PromotionListType[] = [
  {
    id: 1,
    title: "Grand Purp Rewards",
  },
  {
    id: 2,
    title: "Grand Purp Rewards 1",
  },
  {
    id: 3,
    title: "Grand Purp Rewards 2",
  },
  {
    id: 4,
    title: "Grand Purp Rewards 3",
  },
  {
    id: 5,
    title: "Grand Purp Rewards 4",
  },
  {
    id: 6,
    title: "Grand Purp Rewards 5",
  },
];

const SetPromotionContainer = () => {
  return (
    <div className="pt-[64px]">
      <div>
        <h4 className="text-base font-medium text-black leading-[120%] pb-2">
          Promotion Lists
        </h4>
      </div>
      <div>
        {promotionList?.map((item) => {
          return (
            <div key={item.id} className="pb-2">
              <h4 className="flex items-center justify-between text-base font-normal leading-[120%] text-[#595959] p-4 rounded-[8px] border border-[#6B46C1]">
                {item.title}{" "}
                <div className="flex items-center gap-2">
                  <button className=" bg-[#6B46C1] p-3 rounded-[4px]">
                    {" "}
                    <SquarePen className="w-4 h-4 text-white" />
                  </button>
                  <button className=" bg-[#6B46C1] p-3 rounded-[2px]">
                    {" "}
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SetPromotionContainer;
