// this is the file where all the web3 logic of this project is stored
// this context will be wrapped with all the pages
import React, {useContext, createContext } from 'react';
import { useAddress, useContract, useContractRead, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { parse } from 'dotenv';

const StateContext = createContext();

export const StateContextProvider = ( { children } ) => {
    const { contract } = useContract('0x503315bD39651cfc9DF2623A6C680e6809B79C71');

    const { mutateAsync : createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
          const data = await createCampaign({
                    args: [
                        address, // owner
                        form.title, // title
                        form.description, // description
                        form.target,
                        new Date(form.deadline).getTime(), // deadline,
                        form.image,
                    ],
                });
    
          console.log("contract call success", data)
        } catch (error) {
          console.log("contract call failure", error)
        }
      }
    
    const getCampaigns = async () => {
        // const campaigns = await contract.call('getCampaigns');

        const data = await contract.call("getCampaigns");
        
        console.log(data);
        
        const campaigns = data.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(
              campaign.amountCollected.toString()
            ),
            image: campaign.image,
            pId: i,
          }));

        return campaigns;
    }

    const getDonations = async (pId) => {
      const donations = await contract.call('getDonators', pId);
      
      const numberOfDonations = donations[0].length;

      const parsedDonations = [];

      for ( let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations.push[0][i],
          donation: ethers.utils.formatEther(donations[1][i].toString())
        })
      }

      console.log(parsedDonations);

      return parsedDonations;
    }

    const getUserCampaigns = async () => {
      // const campaigns = await contract.call('getCampaigns');

      const allCampaigns = await getCampaigns();
      
      // console.log(data);
      
      const userCampaigns = allCampaigns.filter((campaign) => campaign.owner == address);

      return userCampaigns;
    }

    const donate = async (pId, amount) => {
      const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});

      console.log("donate data: " ,data);
  
      return data;
    }

    return(
        <StateContext.Provider 
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

// creating a custom hook
export const useStateContext = () => useContext(StateContext);