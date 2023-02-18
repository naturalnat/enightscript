function myFunction() {
    function importData() {
      const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TurnOut");
      let count = 1;
      const urlList = [ ///this is where to put the JSON URL of each locality. the code will loop through each one and extract data from each one 
        "https://results.elections.virginia.gov/vaelections/2022%20November%20General/Json/Locality/ACCOMACK_COUNTY/Member_House_of_Representatives_(02).json",
        "https://results.elections.virginia.gov/vaelections/2022%20November%20General/Json/Locality/CHESAPEAKE_CITY/Member_House_of_Representatives_(02).json",
        "https://results.elections.virginia.gov/vaelections/2022%20November%20General/Json/Locality/FRANKLIN_CITY/Member_House_of_Representatives_(02).json",
        "https://results.elections.virginia.gov/vaelections/2022%20November%20General/Json/Locality/ISLE_OF_WIGHT_COUNTY/Member_House_of_Representatives_(02).json",
        "https://results.elections.virginia.gov/vaelections/2022%20November%20General/Json/Locality/NORTHAMPTON_COUNTY/Member_House_of_Representatives_(02).json",
        "https://results.elections.virginia.gov/vaelections/2022%20November%20General/Json/Locality/SOUTHAMPTON_COUNTY/Member_House_of_Representatives_(02).json",
        "https://results.elections.virginia.gov/vaelections/2022%20November%20General/Json/Locality/SUFFOLK_CITY/Member_House_of_Representatives_(02).json",
        "https://results.elections.virginia.gov/vaelections/2022%20November%20General/Json/Locality/VIRGINIA_BEACH_CITY/Member_House_of_Representatives_(02).json"
  ]
  
      for (let k = 0; k < urlList.length; k++) {
        const text = UrlFetchApp.fetch(urlList[k]).getContentText();
        const data = JSON.parse(text)
        const headers = [[data.Locality.LocalityName,
        data.Precincts[0].Candidates[0].BallotName, [], [],
        data.Precincts[0].Candidates[1].BallotName, [], [],
        data.Precincts[0].Candidates[2].BallotName, [], [],
          "Early Voting", //hard coded headers for progress status 
          "Election Day",
          "Mailed Absentee",
          "Provisional"]]
  
        ss.getRange(count, 1, 1, headers[0].length).setValues(headers);
        count++;
        delete headers;
  
        let status = true;
  
        for (let i = 0; i < data.Precincts.length; i++) {
          if (data.Precincts[i].Candidates[0].Votes === '') Logger.log(data.Locality.LocalityName)
          let arr = [[
            data.Precincts[i].PrecinctName,
            data.Precincts[i].Candidates[0].Votes, data.Precincts[i].Candidates[0].Percentage, [],
            data.Precincts[i].Candidates[1].Votes, data.Precincts[i].Candidates[1].Percentage, [],
            data.Precincts[i].Candidates[2].Votes, data.Precincts[i].Candidates[2].Percentage, [],
          ]]
          ss.getRange(count, 1, 1, arr[0].length).setValues(arr);
  
          // this gets the results progress for each locality and outputs next to the respective locality in the sheet
          if (status) {
            let statusArr = [[data.ResultsProgress.EarlyVoting,
            data.ResultsProgress.ElectionDay,
            data.ResultsProgress.MailedAbsentee,
            data.ResultsProgress.Provisional]]
            ss.getRange(count, arr[0].length + 1, 1, statusArr[0].length).setValues(statusArr);
            status = false
          }
          delete arr;
          count++;
        }
        status = true
  
        count += 1
  
      }
    }
    importData();
  }