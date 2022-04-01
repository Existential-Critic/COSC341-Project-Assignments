#Import needed libraries
import csv
import os

##INITIALISE NEEDED VARIABLES
#Get the directories of the log files
t1LogDir = 'C:/Users/Soren/Desktop/Y4 GitHub/COSC341-Project-Assignments/PA6/PA6-T1/Logs/'
t2LogDir = 'C:/Users/Soren/Desktop/Y4 GitHub/COSC341-Project-Assignments/PA6/PA6-T2/Logs/'
#Get the list of filenames from the directories
t1FileList = os.listdir(t1LogDir)
t2FileList = os.listdir(t2LogDir)
t1LogFiles = []
t2LogFiles = []
#Add the directory to the file name for each file list
for file in t1FileList:
    t1LogFiles.append(t1LogDir+file)
for file in t2FileList:
    t2LogFiles.append(t2LogDir+file)
#Get the files we will be writing data to
t1Accuracy = 'C:/Users/Soren/Desktop/Y4 GitHub/COSC341-Project-Assignments/PA6/PA6-T1/T1ResultsAccuracy.csv'
t1Times = 'C:/Users/Soren/Desktop/Y4 GitHub/COSC341-Project-Assignments/PA6/PA6-T1/T1ResultsTime.csv'
t2Accuracy = 'C:/Users/Soren/Desktop/Y4 GitHub/COSC341-Project-Assignments/PA6/PA6-T2/T2ResultsAccuracy.csv'
t2Times = 'C:/Users/Soren/Desktop/Y4 GitHub/COSC341-Project-Assignments/PA6/PA6-T2/T2ResultsTime.csv'
#Lists to store information from files
t1AccuracyList = []
t1TimeList = []
t2AccuracyList = []
t2TimeList = []

##TECHNIQUE 1
#Access each csv file for T1
for fileName in t1LogFiles:
    #Open the file to be read
    with open(fileName,'r') as file:
        #Initialise needed variables for this file
        fileTimes = []
        fileAccuracy = 0
        csvReader = csv.reader(file)
        #Iterate through each row of the file
        for row in csvReader:
            #Append the times and increment correct answers
            fileTimes.append(int(row[3]))
            if(row[1]==row[2]):
                fileAccuracy +=1
        #Append the average time and the correct ratio to the global lists
        t1AccuracyList.append(fileAccuracy/60)
        averageTime = round(sum(fileTimes)/len(fileTimes),2)
        t1TimeList.append(averageTime)
#Write the saved data to the respective T1 csv files
with open(t1Accuracy,'w+') as t1AccuracyFile:
    t1AccuracyWriter = csv.writer(t1AccuracyFile)
    t1AccuracyWriter.writerow(['AVERAGE CORRECT RATIO'])