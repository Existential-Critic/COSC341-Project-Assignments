#Import needed libraries
import csv
from math import sqrt
from re import S

##INITIALISE NEEDED VARIABLES
#Get the hypotheses Hr and Hn
hR = "The mean time of Technique 1 is significantly different than the mean time of Technique 2."
hN = "The mean times of Technique 1 and Technique 2 are the same."
#Get the populations
pop1 = "Trials of Technique 1"
pop2 = "Trials of Technique 2"
#Get the files to get data from
t1TimeFile = 'C:/Users/Soren/Desktop/Y4 GitHub/COSC341-Project-Assignments/PA6/PA6-T1/T1ResultsTime.csv'
t2TimeFile = 'C:/Users/Soren/Desktop/Y4 GitHub/COSC341-Project-Assignments/PA6/PA6-T2/T2ResultsTime.csv'
#Get the file to write data to
tTestFile = 'C:/Users/Soren/Desktop/Y4 GitHub/COSC341-Project-Assignments/PA6/twoSampleTTest.csv'
#Get the lists of times
t1Times = []
t2Times = []
#Get the standard deviations
t1STD = 0
t2STD = 0

##ACCESS THE CSV FILES
#For Technique 1
with open(t1TimeFile,'r') as t1File:
    t1Reader = csv.reader(t1File)
    for row in t1Reader:
        #Go through each row, if it can be converted to a float append it
        try:
            t1Times.append(float(row[0]))
        except:
            if row[0] == 'Time STD:':
                t1STD = row[1]
#For Technique 2
with open(t2TimeFile,'r') as t2File:
    t2Reader = csv.reader(t2File)
    for row in t2Reader:
        #Go through each row, if it can be converted to a float append it
        try:
            t2Times.append(float(row[0]))
        except:
            if row[0] == 'Time STD:':
                t2STD = row[1]

#T-TEST CALCULATIONS
#Get the sample size for each
N = 5
#Get the differences of each
differencesList = []
for i in range(5):
    difference = round(t2Times[i]-t1Times[i],2)
    differencesList.append(difference)
totalDifference = sum(differencesList)
print(totalDifference)
#Get the mean difference score
M = totalDifference/N
#Get the deviation
deviationsList = []
for diff in differencesList:
    deviation = round(diff-M,3)
    deviationsList.append(deviation)
#Get Σ(X-M)^2
sumSqrDev = 0
for dev in deviationsList:
    sumSqrDev += round(dev*dev,3)
#Get s2 for pop2
s2 = sumSqrDev/(N-1)
#Get u, the difference of pop2 (by definition, no difference)
u = 0
#Get characteristics of distribution of means
uM = u
s2M = s2/N
sM = round(sqrt(s2M),3)
#Get degrees of freedom
df = N-1
#Get the cutoff value for df = 4 at 5% significance
cutoffNeg = -2.776
cutoffPos = 2.776
#Calculate the t score
tScore = round((M-u)/sM,3)
#Check if the t score is more extreme than the cutoff
tScoreResult = False
if tScore > cutoffPos:
    tScoreResult = True
elif tScore < cutoffNeg:
    tScoreResult = True
#Get our significance statement
finalStatement = ''
if tScoreResult:
    finalStatement = 'We can interpret the finding that the mean times of Technique 1 are different than the mean times of Technique 2. With this, we can reject the null hypothesis.'
else:
    finalStatement = 'We cannot interpret the finding that the mean times of Technique 1 are different than the mean times of Technique 2. We cannot reject the null hypothesis at this time.'

##WRITE THE DATA TO A NEW CSV
with open(tTestFile,'w+',newline='') as tFile:
    tTestWriter = csv.writer(tFile)
    tTestWriter.writerow(["Research Hypothesis",hR])
    tTestWriter.writerow(["Null Hypothesis",hN])
    tTestWriter.writerow('')
    tTestWriter.writerow(["Population 1",pop1])
    tTestWriter.writerow(["Population 2",pop2])
    tTestWriter.writerow('')
    tTestWriter.writerow(["INFORMATION ABOUT THE TEST SAMPLE"])
    tTestWriter.writerow(["N =",N])
    tTestWriter.writerow(["M =",M])
    tTestWriter.writerow('')
    tTestWriter.writerow(["INFORMATION ABOUT THE POPULATION 2"])
    tTestWriter.writerow(["u =",u])
    tTestWriter.writerow(["S^2 =",s2])
    tTestWriter.writerow('')
    tTestWriter.writerow(["CHARACTERISTICS OF THE DISTRIBUTION OF MEANS"])
    tTestWriter.writerow(["uM = u =",uM])
    tTestWriter.writerow(["S^2M",s2M])
    tTestWriter.writerow(["SM =",sM])
    tTestWriter.writerow(["df =",df])
    tTestWriter.writerow(["cutoff =",cutoffNeg,cutoffPos])
    tTestWriter.writerow(["t-score =",tScore])
    tTestWriter.writerow('')
    tTestWriter.writerow([finalStatement])
