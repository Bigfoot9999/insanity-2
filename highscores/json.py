#!/usr/bin/env python3

def writeTo(user, deaths):
    file = open('highscoresJSON.js', 'r').read()
    original = file[17:-2]
    jsonFile = open('highscoresJSON.js', 'w')
    jsonFile.write('let highscores = ' + str(original + ", '" + user + "'" + ': ' + str(deaths) + ',}'))

if __name__ == '__main__':
    writeTo('DKJ', 81111)