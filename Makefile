.PHONY: store 

store:
	@echo "Building..."
	@zip faster_pageload.zip * -r
	@echo "Build completed."

clean:
	@echo "Started cleaning...."
	@rm faster_pageload.zip 
	@echo "Finished cleaning"
