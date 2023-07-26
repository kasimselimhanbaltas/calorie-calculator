from pickle import NONE
import bs4
from selenium import webdriver
import os
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import psycopg2
from colorama import Fore, Back, Style

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

driver = webdriver.Chrome('C:\\Users\\kasim\\Documents\\seleniumdriver\\chromedriver.exe')

search_URL = "https://www.google.com/search?q=Supra+Mark+IV&tbm=isch&ved=2ahUKEwidsLPdyof6AhWc8LsIHXPCBSMQ2-cCegQIABAA&oq=Supra+Mark+IV&gs_lcp=CgNpbWcQA1DVBVigCWCcEWgBcAB4AIABWogBswGSAQEymAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=byAbY928HJzh7_UP84SXmAI"
driver.get(search_URL)

#//*[@id="islrg"]/div[1]/div[1]
#//*[@id="islrg"]/div[1]/div[50]
#//*[@id="islrg"]/div[1]/div[25]
#//*[@id="islrg"]/div[1]/div[75]
#//*[@id="islrg"]/div[1]/div[350]


def getImageURL(foodName):

  searchQuery = (foodName)
  print(Fore.YELLOW + f"\n************IMAGES FETCHING FOR {searchQuery} ************", end="")
  print(Style.RESET_ALL)
  elem = driver.find_element(By.NAME, "q")
  elem.clear()
  elem.send_keys(searchQuery)
  elem.send_keys(Keys.RETURN)
  #Scrolling all the way up
  driver.execute_script("window.scrollTo(0, 0);")

  page_html = driver.page_source
  pageSoup = bs4.BeautifulSoup(page_html, 'html.parser')
  #image containers-> findall finds all of the containers in the current page
  containers = pageSoup.findAll('div', {'class':"isv-r PNCib MSM1fd BUooTd"} )
  maximages = 11
  i = 1
  while i < maximages:
      if (i==len(containers)):
          print(Fore.RED + "Opps, there are no more images in the page :(", end="")
          print(Style.RESET_ALL)
          break
      if (i % 25 == 0):
          i+=1
          continue

      print(Fore.YELLOW + "*************************image number", i, end="")
      print(Style.RESET_ALL)

      #xpath for the images, i is image number
      xPath = """//*[@id="islrg"]/div[1]/div[%s]"""%(i)

      previewImageXPath = """//*[@id="islrg"]/div[1]/div[%s]/a[1]/div[1]/img"""%(i)
      previewImageElement = driver.find_element(By.XPATH,previewImageXPath)
      #container/image/src is what we need so we are getting that
      previewImageURL = previewImageElement.get_attribute("src")

      driver.find_element(By.XPATH,xPath).click()

      timeStarted = time.time()
      while True:
          try: 
             imageElement = driver.find_element(By.XPATH,"""//*[@id="Sva75c"]/div[2]/div[2]/div[2]/div[2]/c-wiz/div/div/div/div[3]/div[1]/a/img[1]""")

          except(Exception):
            imageElement = driver.find_element(By.XPATH,"""//*[@id="Sva75c"]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[3]/div/a/img""")

          imageURL= imageElement.get_attribute('src')

          if imageURL != previewImageURL:
              #print("actual URL", imageURL)
              if (int(imageElement.get_attribute('naturalHeight'))==0 or int(imageElement.get_attribute('naturalWidth'))==0):
                  maximages+=1
                  print(Fore.RED + "Error: Width or Height is 0!", end="")
                  print(Style.RESET_ALL)
                  break
              ar = int(imageElement.get_attribute('naturalWidth'))/int(imageElement.get_attribute('naturalHeight'))
              width = int(imageElement.get_attribute('naturalWidth'))
              height = int(imageElement.get_attribute('naturalHeight'))
              if(ar >= 1.2 and ar <= 2 and width>=700 and width<=1500):
                  print(Fore.GREEN + "Perfect image: ","Aspect Ratio: ", ar, " Width: ", width, " Height: ",height, end="")
                  print(Style.RESET_ALL)

                  return imageURL

    
              else:
                  print(Fore.RED + "Bad image, passing.", end="")
                  print(Style.RESET_ALL)
                  maximages += 1
                  break
              break

          else:
              #making a timeout if the full res image can't be loaded
              currentTime = time.time()
              

              if currentTime - timeStarted > 10:
                  print(Fore.RED + "Timeout! We couldn't download full size image, net error!", end="")
                  print(Style.RESET_ALL)
                  maximages += 1
                  break

      i+=1
      


# Firebase Admin SDK için kimlik doğrulama dosyanızı buraya ekleyin (.json uzantılı)
# Not: Bu dosyayı Firebase konsolunda oluşturabilirsiniz.
cred = credentials.Certificate("./credentials.json")

# Firebase projenize bağlanın
firebase_admin.initialize_app(cred)

# Firestore veritabanı nesnesini alın
db = firestore.client()

# 'foods' koleksiyonuna referans oluşturun
foods_ref = db.collection("foods")

# Her bir dökümana 'imageURL' özelliğini ekleyin
def add_image_url_to_food(doc, IimgUrl):
    doc_ref = foods_ref.document(doc.id)
    doc_ref.update({"imageURL": IimgUrl})

# foods koleksiyonundaki tüm dökümanları alın
foods_docs = foods_ref.stream()

# Her bir dökümana 'imageURL' eklemek için döngüyü çalıştırın
for doc in foods_docs:
    
    doc_dict = doc.to_dict()
    
    if "imageURL" in doc_dict:
      continue
    # 'food' özelliğini alın
    food_name = doc_dict.get("Food")

    # 'imageURL' özelliğini ekleyin
    doc_ref = foods_ref.document(doc.id)

    imgurl = getImageURL(food_name)
    add_image_url_to_food(doc, imgurl)
    print(f"Added imageURL to {doc.id}")

print("ImageURLs added successfully to all documents.")



