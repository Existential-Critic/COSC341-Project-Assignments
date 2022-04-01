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